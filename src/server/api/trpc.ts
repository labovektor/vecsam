/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/server/db";
import { createClient } from "@/lib/supabase/server";
import { AuthenticationError } from "@/use-cases/errors";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { rateLimiter } from "@/lib/rate-limiter";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const c = await cookies();

  // 🔍 Coba ambil dari header yang umum dipakai reverse proxy
  const ip = opts.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  return {
    db,
    cookies: c,
    ip,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

const authMiddleware = t.middleware(async ({ ctx, next }) => {
  const supabaseServerClient = await createClient();

  const { data } = await supabaseServerClient.auth.getUser();

  if (!data.user) throw new AuthenticationError();

  try {
    await rateLimiter({
      points: 10,
      duration: 1,
      keyPrefix: "rl:auth",
      consumeKey: data.user.id,
    });
  } catch (error) {
    throw new Error("Terlalu Banyak Request");
  }

  return await next({
    ctx: {
      ...ctx,
      user: data.user,
    },
  });
});

const examMiddleware = t.middleware(async ({ ctx, next }) => {
  const token = ctx.cookies.get("xt_val")?.value;

  if (!token) throw new AuthenticationError();
  let payload: { sub: string; examId: string };
  try {
    payload = verifyJwt(token);
  } catch (error) {
    throw new AuthenticationError();
  }

  try {
    await rateLimiter({
      points: 3,
      duration: 1,
      keyPrefix: "rl:exam",
      consumeKey: payload.sub,
    });
  } catch (error) {
    throw new Error("Terlalu Banyak Request");
  }

  // Ambil session dari DB
  const session = await ctx.db.participantSession.findUnique({
    where: { participantId: payload.sub },
    include: {
      participant: true,
    },
  });

  const now = new Date();

  if (
    !session ||
    session.token !== token ||
    session.expiredAt < now ||
    session.participant.lockedAt
  ) {
    throw new AuthenticationError();
  }

  return await next({
    ctx: {
      ...ctx,
      session,
    },
  });
});

const defaultRateLimiter = t.middleware(async ({ ctx, next }) => {
  try {
    await rateLimiter({
      points: 10,
      duration: 1,
      keyPrefix: "rl:default",
      consumeKey: ctx.ip,
    });
  } catch (error) {
    throw new Error("Terlalu Banyak Request");
  }
  return await next();
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(defaultRateLimiter);
export const protectedProcedure = t.procedure.use(authMiddleware);

export const examProcedure = t.procedure.use(examMiddleware);

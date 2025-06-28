import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { adminAuthRouter } from "./routers/admin-auth";
import { examRouter } from "./routers/exam";
import { questionRouter } from "./routers/question";
import { sectionRouter } from "./routers/section";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  adminAuth: adminAuthRouter,
  exam: examRouter,
  section: sectionRouter,
  question: questionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

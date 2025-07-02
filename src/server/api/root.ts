import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { adminAuthRouter } from "./routers/admin-auth";
import { examManagementRouter } from "./routers/exam";
import { questionRouter } from "./routers/question";
import { sectionRouter } from "./routers/section";
import { participantManagementRouter } from "./routers/participant-management";
import { participantAuthRouter } from "./routers/participant-auth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  adminAuth: adminAuthRouter,
  participantAuth: participantAuthRouter,
  examManagement: examManagementRouter,
  section: sectionRouter,
  question: questionRouter,
  participantManagement: participantManagementRouter,
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

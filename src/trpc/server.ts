import "server-only";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache } from "react";
import { createQueryClient } from "./query-client";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

export const getQueryClient = cache(createQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: async () =>
    createTRPCContext({
      headers: await headers(),
    }),
  router: appRouter,
  queryClient: getQueryClient,
});

import { loginSchema, registerSchema } from "@/features/admin-auth/schema";
import { getBaseUrl } from "@/lib/get-base-url";
import { createClient, supabaseAdminClient } from "@/lib/supabase/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import z from "zod";

export const adminAuthRouter = createTRPCRouter({
  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const { email, password } = input;

    return supabaseAdminClient.auth.signInWithPassword({
      email,
      password,
    });
  }),

  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;

      return supabaseAdminClient.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
    }),

  getUser: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata.name,
    };
  }),

  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return supabaseAdminClient.auth.updateUser({
        data: { name: input.name },
      });
    }),

  resetPasswordReq: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return supabaseAdminClient.auth.resetPasswordForEmail(input.email, {
        redirectTo: getBaseUrl() + "/reset-password",
      });
    }),
});

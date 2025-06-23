import { loginSchema, registerSchema } from "@/features/admin-auth/schema";
import { createClient, supabaseAdminClient } from "@/lib/supabase/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

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
});

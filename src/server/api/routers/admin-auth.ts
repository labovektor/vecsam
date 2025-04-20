import { loginSchema, registerSchema } from "@/features/admin-auth/schema";
import { createClient } from "@/lib/supabase/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PublicError } from "@/use-cases/errors";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const adminAuthRouter = createTRPCRouter({
  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const supabase = await createClient();
    const { email, password } = input;

    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  }),

  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const supabase = await createClient();
      const { name, email, password } = input;

      return supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
    }),
});

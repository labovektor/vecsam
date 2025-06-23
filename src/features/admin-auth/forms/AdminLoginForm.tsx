"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginSchemaType,
} from "@/features/admin-auth/schema";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const DashboardLoginForm = () => {
  const router = useRouter();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const login = api.adminAuth.login.useMutation({
  //   onError: (err) => {
  //     toast.error(err.message);
  //   },
  //   onSuccess: () => {
  //     router.replace("/dashboard");
  //   },
  // });

  async function onSubmit(values: LoginSchemaType) {
    const supabase = createClient();
    const res = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (res.error) {
      toast.error(res.error.message);
    }

    router.replace("/dashboard");
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={form.formState.isLoading}
        >
          {form.formState.isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default DashboardLoginForm;

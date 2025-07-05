"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchemaType,
} from "@/features/admin-auth/schema";
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

const AdminForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPassword = api.adminAuth.resetPasswordReq.useMutation({
    onSuccess: () => {
      toast.success(
        "Kami telah mengirimkan link reset password ke email Anda.",
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  async function onSubmit(values: ForgotPasswordSchemaType) {
    forgotPassword.mutate(values);
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

        <Button
          className="w-full"
          type="submit"
          disabled={forgotPassword.isPending}
        >
          {forgotPassword.isPending
            ? "Mengirimkan Link..."
            : "Kirimkan Link Reset Password"}
        </Button>
      </form>
    </Form>
  );
};

export default AdminForgotPasswordForm;

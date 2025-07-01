"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginSchemaType,
} from "@/features/participant-auth/schema";
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
import { setCookie } from "cookies-next/client";
import { loginAction } from "../actions";

const ExamLoginForm = () => {
  const router = useRouter();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      participantCode: "",
      examCode: "",
    },
  });

  // const login = api.participantAuth.login.useMutation({
  //   onError: (err) => {
  //     toast.error(err.message);
  //   },
  //   onSuccess: (data) => {
  //     // router.replace("/dashboard");
  //     console.log("Login data: ", data);
  //     setCookie("xt_val", data.token, {
  //       httpOnly: true,
  //     });
  //   },
  // });

  async function onSubmit(values: LoginSchemaType) {
    const res = await loginAction(values);
    if (res.error) {
      toast.error(res.error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="participantCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode Peserta</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="examCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode Ujian</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Sedang Masuk..." : "Masuk"}
        </Button>
      </form>
    </Form>
  );
};

export default ExamLoginForm;

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

const ExamLoginForm = () => {
  const router = useRouter();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      participantCode: "",
      examCode: "",
    },
  });

  const login = api.participantAuth.login.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: (data) => {
      router.replace(`/x-lgn/confirm?xt_id=${data.id}`);
    },
  });

  async function onSubmit(values: LoginSchemaType) {
    login.mutate(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="participantCode"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-2">
                <FormLabel className="text-nowrap">Kode Peserta</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="examCode"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-2">
                <FormLabel className="text-nowrap">Kode Ujian</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={login.isPending}>
          {login.isPending ? "Sedang Masuk..." : "Masuk"}
        </Button>
      </form>
    </Form>
  );
};

export default ExamLoginForm;

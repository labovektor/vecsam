"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { examSchema, type ExamSchemaType } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatetimePicker } from "@/components/ui/date-time-picker";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const NewExamForm = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const form = useForm<ExamSchemaType>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: "",
      description: "",
      passcode: "",
      startTime: new Date(),
      endTime: new Date(),
      duration: 0,
    },
  });

  const trpc = useTRPC();
  const createNewExam = useMutation(
    trpc.examManagement.create.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: trpc.examManagement.getAll.queryKey(),
        });
        toast.success("New Exam Created");
        setOpen(false);
      },
    }),
  );

  async function onSubmit(values: ExamSchemaType) {
    createNewExam.mutate(values);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: "default" })}>
        <Plus /> New Exam
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Exam</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <DatetimePicker
                      {...field}
                      dtOptions={{
                        hour12: false,
                      }}
                      format={[
                        ["days", "months", "years"],
                        ["hours", "minutes"],
                      ]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <DatetimePicker
                      {...field}
                      dtOptions={{
                        hour12: false,
                      }}
                      format={[
                        ["days", "months", "years"],
                        ["hours", "minutes"],
                      ]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durasi (Menit)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Durasi ujian dalam menit. Minimal 10 menit
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passcode</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={createNewExam.isPending}
              className="w-full"
            >
              {createNewExam.isPending ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewExamForm;

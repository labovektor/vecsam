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
import { api } from "@/trpc/react";
import type { Exam } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { Edit } from "lucide-react";

const EditExamForm = ({
  id,
  cValue,
}: {
  id: string;
  cValue: Partial<Exam>;
}) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const form = useForm<ExamSchemaType>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: cValue.title ?? "",
      description: cValue.description ?? "",
      passcode: cValue.passcode ?? "",
      startTime: cValue.startTime ?? new Date(),
      endTime: cValue.endTime ?? new Date(),
      duration: cValue.duration ?? 0,
    },
  });

  const createNewExam = api.examManagement.update.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: getQueryKey(api.examManagement.getAll),
      });
      toast.success("Exam Successfully Updated");
      setOpen(false);
    },
  });

  async function onSubmit(value: ExamSchemaType) {
    createNewExam.mutate({ id, value });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          {" "}
          <Edit /> Edit Exam
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Exam</DialogTitle>
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

export default EditExamForm;

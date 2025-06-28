"use client";

import type { Question } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { editQuestionSchema, type EditQuestionSchemaType } from "../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fileToBase64 } from "@/lib/form-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import TiptapInput from "@/components/ui/tiptap";
import { getQueryKey } from "@trpc/react-query";

const EditQuestionForm = ({ question }: { question: Question }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const form = useForm<EditQuestionSchemaType>({
    resolver: zodResolver(editQuestionSchema),
    defaultValues: {
      number: question.number,
      text: question.text ?? "",
      image: undefined,
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      console.log(base64);
      form.setValue("image", base64);
    }
  };

  const editQuestion = api.question.editQuestion.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: getQueryKey(api.question.getQuestions),
      });
      setOpen(false);
      toast.success("Pertanyaan berhasil diubah");
    },
  });

  const handleSubmit = (data: EditQuestionSchemaType) => {
    console.log("Form submitted", data);
    editQuestion.mutate({
      id: question.id,
      question: data,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="icon" onClick={() => setOpen(true)}>
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-3xl">
        <DialogHeader>
          <DialogTitle>Ubah Pertanyaan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormLabel>Nomor</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-end gap-2">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem className="flex-[2]">
                    <FormLabel>Pertanyaan</FormLabel>
                    <FormControl>
                      <TiptapInput
                        placeholder="Tulis pertanyaan disini"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Ubah Gambar Saat Ini (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={editQuestion.isPending}
            >
              {editQuestion.isPending ? "Loading..." : "Ubah Pertanyaan"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuestionForm;

"use client";

import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  editQuestionAttrSchema,
  type EditQuestionAttrSchemaType,
} from "../schema";
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
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { getQueryKey } from "@trpc/react-query";

const EditQuestionAttrForm = ({
  type,
  questionId,
}: {
  type: "file" | "templateFile";
  questionId: string;
}) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const form = useForm<EditQuestionAttrSchemaType>({
    resolver: zodResolver(editQuestionAttrSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      form.setValue("file", base64);
    }
  };

  const editAttr = api.question.editQuestionAttr.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: getQueryKey(api.question.getQuestions),
      });
      setOpen(false);
      toast.success("Detail berhasil diubah");
    },
  });

  const handleSubmit = (data: EditQuestionAttrSchemaType) => {
    console.log("Form submitted", data);
    editAttr.mutate({
      type,
      questionId,
      attr: data,
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
          <DialogTitle>
            {type === "file" ? "Ubah File Pertanyaan" : "Ubah Template Jawaban"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileChange(e)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={editAttr.isPending}
            >
              {editAttr.isPending ? "Loading..." : "Ubah Detail"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuestionAttrForm;

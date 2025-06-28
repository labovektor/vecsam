"use client";

import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  addMultipleChoiceOptionSchema,
  type AddMultipleChoiceOptionSchemaType,
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
import { Plus } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import TiptapInput from "@/components/ui/tiptap";
import { getQueryKey } from "@trpc/react-query";

const AddMutipleChoiceOptionForm = ({ questionId }: { questionId: string }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const form = useForm<AddMultipleChoiceOptionSchemaType>({
    resolver: zodResolver(addMultipleChoiceOptionSchema),
    defaultValues: {
      text: "",
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

  const addOption = api.question.addMulitpleChoiceOption.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: getQueryKey(api.question.getQuestions),
      });
      setOpen(false);
      toast.success("Opsi jawaban berhasil ditambahkan");
    },
  });

  const handleSubmit = (data: AddMultipleChoiceOptionSchemaType) => {
    console.log("Form submitted", data);
    addOption.mutate({
      questionId,
      option: data,
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
        <Button size="icon" variant="secondary" onClick={() => setOpen(true)}>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-3xl">
        <DialogHeader>
          <DialogTitle>Tambahkan Opsi Jawaban</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="flex gap-2 p-2">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem className="flex-[2]">
                    <FormControl>
                      <TiptapInput
                        placeholder="Ketikkan opsi jawaban atau masukkan gambar di samping"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={addOption.isPending}
            >
              {addOption.isPending ? "Loading..." : "Tambah Opsi Jawaban"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMutipleChoiceOptionForm;

"use client";

import type { SectionType } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { addQuestionSchema, type AddQuestionSchemaType } from "../schema";
import { useFieldArray, useForm } from "react-hook-form";
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
import { CircleDot, Trash } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import TiptapInput from "@/components/ui/tiptap";

const AddQuestionForm = ({
  sectionId,
  sectionType,
}: {
  sectionId: string;
  sectionType: SectionType;
}) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const form = useForm<AddQuestionSchemaType>({
    resolver: zodResolver(addQuestionSchema),
    defaultValues: {
      number: 1,
      text: "",
      image: undefined,
      questionAttr: undefined,
      multipleChoiceOptions: [],
    },
  });

  const {
    fields: multipleChoiceFields,
    append: addChoiceOption,
    remove: removeChoiceOption,
  } = useFieldArray({
    control: form.control,
    name: "multipleChoiceOptions",
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      console.log(base64);
      form.setValue("image", base64);
    }
  };

  const handleAttrFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "file" | "templateFile",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      form.setValue(`questionAttr.${field}`, base64 as any);
    }
  };

  const handleOptionImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      form.setValue(`multipleChoiceOptions.${index}.image`, base64);
    }
  };

  const addQuestion = api.question.addQuestion.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["question", sectionId] });
      setOpen(false);
      toast.success("Pertanyaan berhasil ditambahkan");
    },
  });

  const handleSubmit = (data: AddQuestionSchemaType) => {
    console.log("Form submitted", data);
    addQuestion.mutate({
      sectionId,
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
        <Button onClick={() => setOpen(true)}>Tambah Pertanyaan</Button>
      </DialogTrigger>
      <DialogContent className="w-3xl">
        <DialogHeader>
          <DialogTitle>Tambahkan Pertanyaan</DialogTitle>
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
                    <FormLabel>Gambar (Opsional)</FormLabel>
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

            {sectionType !== "SHORT_ANSWER" && (
              <span className="my-4 block rounded-full bg-slate-100 text-center text-sm font-semibold">
                {sectionType === "MULTIPLE_CHOICE"
                  ? "Pilihan Jawaban"
                  : "Detail Untuk Peserta"}
              </span>
            )}

            {sectionType === "FILE_ANSWER" && (
              <>
                <FormField
                  control={form.control}
                  name="questionAttr.file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Pertanyaan</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleAttrFileChange(e, "file")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="questionAttr.templateFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Jawaban</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) =>
                            handleAttrFileChange(e, "templateFile")
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
            {sectionType === "MULTIPLE_CHOICE" && (
              <>
                {multipleChoiceFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-2 rounded-md bg-blue-50 p-2"
                  >
                    <FormField
                      control={form.control}
                      name={`multipleChoiceOptions.${index}.text`}
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
                      name={`multipleChoiceOptions.${index}.image`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleOptionImageChange(e, index)
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      size={"icon"}
                      variant="destructive"
                      onClick={() => removeChoiceOption(index)}
                    >
                      <Trash />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => addChoiceOption({ text: "", image: "" })}
                  className="w-full"
                >
                  Tambah Opsi Jawaban
                </Button>
              </>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={addQuestion.isPending}
            >
              {addQuestion.isPending ? "Loading..." : "Tambah Pertanyaan"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestionForm;

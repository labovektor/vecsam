import { fileToBase64Zod } from "@/lib/zod-utils";
import { z } from "zod";

export const sectionTypes = [
  "MULTIPLE_CHOICE",
  "SHORT_ANSWER",
  "FILE_ANSWER",
] as [string, ...string[]];

export function formatSectionType(type: string) {
  switch (type) {
    case "MULTIPLE_CHOICE":
      return "Pilihan Ganda";
    case "SHORT_ANSWER":
      return "Isian Singkat";
    case "FILE_ANSWER":
      return "Jawaban File";
    default:
      return "Tidak diketahui";
  }
}

export const addSectionSchema = z.object({
  title: z.string().min(2, "Harus diisi!"),
  type: z.enum(sectionTypes),
  examId: z.string().uuid(),
  points: z.number({ coerce: true }),
});

export const updateSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(2, "Harus diisi!"),
  type: z.enum(sectionTypes),
  points: z.number({ coerce: true }),
});

export const addQuestionSchema = z.object({
  text: z.string().optional(),
  image: fileToBase64Zod({ type: "image" }).optional(),
  questionAttr: z
    .object({
      file: fileToBase64Zod({ type: "pdf" }),
      templateFile: fileToBase64Zod({ type: "pdf" }),
    })
    .optional(),
  multipleChoiceOptions: z
    .array(
      z.object({
        text: z.string().optional(),
        image: fileToBase64Zod({ type: "image" }).optional(),
      }),
    )
    .optional(),
});

export type AddSectionSchemaType = z.infer<typeof addSectionSchema>;
export type UpdateSectionSchemaType = z.infer<typeof updateSectionSchema>;
export type AddQuestionSchemaType = z.infer<typeof addQuestionSchema>;

import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
  number: z.number({ coerce: true }).min(1),
  text: z.string().min(2, "Harus diisi!"),
  image: z.string().optional(),
  questionAttr: z
    .object({
      file: z.string(),
      templateFile: z.string(),
    })
    .optional(),
  multipleChoiceOptions: z
    .array(
      z.object({
        text: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .optional(),
});

export type AddSectionSchemaType = z.infer<typeof addSectionSchema>;
export type UpdateSectionSchemaType = z.infer<typeof updateSectionSchema>;
export type AddQuestionSchemaType = z.infer<typeof addQuestionSchema>;

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
  correctPoint: z.number({ coerce: true }),
  wrongPoint: z.number({ coerce: true }),
  passPoint: z.number({ coerce: true }),
});

export const updateSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(2, "Harus diisi!"),
  type: z.enum(sectionTypes),
  correctPoint: z.number({ coerce: true }),
  wrongPoint: z.number({ coerce: true }),
  passPoint: z.number({ coerce: true }),
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

export const editQuestionSchema = z.object({
  number: z.number({ coerce: true }).min(1),
  text: z.string().min(2, "Harus diisi!"),
  image: z.string().optional(),
});

export const addMultipleChoiceOptionSchema = z.object({
  text: z.string().min(2, "Harus diisi!"),
  image: z.string().optional(),
});

export const editMultipleChoiceOptionSchema = z.object({
  text: z.string().optional(),
  image: z.string().optional(),
});

export const editQuestionAttrSchema = z.object({
  file: z.string(),
});

export type AddSectionSchemaType = z.infer<typeof addSectionSchema>;
export type UpdateSectionSchemaType = z.infer<typeof updateSectionSchema>;
export type AddQuestionSchemaType = z.infer<typeof addQuestionSchema>;
export type EditQuestionSchemaType = z.infer<typeof editQuestionSchema>;
export type AddMultipleChoiceOptionSchemaType = z.infer<
  typeof addMultipleChoiceOptionSchema
>;
export type EditMultipleChoiceOptionSchemaType = z.infer<
  typeof editMultipleChoiceOptionSchema
>;
export type EditQuestionAttrSchemaType = z.infer<typeof editQuestionAttrSchema>;

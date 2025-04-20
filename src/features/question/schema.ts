import { z } from "zod";

export const sectionTypes = [
  "MULTIPLE_CHOICE",
  "SHORT_ANSWER",
  "FILE_ANSWER",
] as [string, ...string[]];

export const addSectionSchema = z.object({
  title: z.string(),
  type: z.enum(sectionTypes),
  examId: z.string().uuid(),
  points: z.number(),
});

export const updateSectionSchema = z.object({
  title: z.string(),
  type: z.enum(sectionTypes),
  points: z.number(),
});

export type AddSectionSchemaType = z.infer<typeof addSectionSchema>;
export type UpdateSectionSchemaType = z.infer<typeof updateSectionSchema>;

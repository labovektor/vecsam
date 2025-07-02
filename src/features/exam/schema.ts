import z from "zod";

export const saveAnswerSchema = z.object({
  answerText: z.string().optional(),
  answerFile: z.string().optional(),
  optionId: z.string().uuid().optional(),
});

export type SaveAnswerSchemaType = z.infer<typeof saveAnswerSchema>;

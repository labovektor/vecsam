import z from "zod";

export const saveAnswerSchema = z.object({
  answerText: z.string().optional(),
  answerFile: z.string().optional(),
  optionId: z.string().uuid().optional(),
});

export const answerRecordSchema = z.record(z.string(), saveAnswerSchema);

export type SaveAnswerSchemaType = z.infer<typeof saveAnswerSchema>;
export type AnswerRecordSchemaType = z.infer<typeof answerRecordSchema>;

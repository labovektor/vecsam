import { z } from "zod";

export const loginSchema = z.object({
  participantCode: z.string().length(6),
  examCode: z.string().length(6),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

import { z } from "zod";

export const loginSchema = z.object({
  participantCode: z.string().length(8, "Passcode harus berisi 8 karakter"),
  examCode: z.string().length(6, "Passcode harus berisi 6 karakter"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

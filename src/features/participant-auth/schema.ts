import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  examCode: z.string().length(6, "Passcode harus berisi 6 karakter"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

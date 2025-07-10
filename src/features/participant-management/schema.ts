import z from "zod";

export const addParticipantSchema = z.object({
  name: z.string().min(3, "Harus diisi!"),
  passcode: z.string().length(8, "Passcode harus berisi 8 karakter"),
});

export type AddParticipantSchemaType = z.infer<typeof addParticipantSchema>;

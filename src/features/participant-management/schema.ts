import z from "zod";

export const addParticipantSchema = z.object({
  name: z.string().min(3, "Harus diisi!"),
  passcode: z.string().length(6, "Passcode harus berisi 6 karakter"),
});

export type AddParticipantSchemaType = z.infer<typeof addParticipantSchema>;

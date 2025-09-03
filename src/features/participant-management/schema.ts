import z from "zod";

export const addParticipantSchema = z.object({
  name: z.string().min(3, "Harus diisi!"),
  email: z.string().email(),
});

export type AddParticipantSchemaType = z.infer<typeof addParticipantSchema>;

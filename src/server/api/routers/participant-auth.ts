import { loginSchema } from "@/features/participant-auth/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { isBefore } from "date-fns";
import { z } from "zod";

export const participantAuthRouter = createTRPCRouter({
  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const { db } = ctx;
    const participant = await db.participant.findFirst({
      where: {
        passcode: input.participantCode,
      },
      include: {
        exam: true,
        participantSession: true,
      },
    });

    if (!participant || participant.exam.passcode !== input.examCode) {
      return {
        error: "Kode tidak valid",
      };
    }

    const now = new Date();

    // Validate if exam is still axtive and not yet ended
    if (!participant.exam.isActive) {
      return {
        error: "Ujian tidak tersedia",
      };
    }
    // if (
    //   isBefore(now, participant.exam.startTime) ||
    //   isBefore(participant.exam.endTime, now)
    // ) {
    //   throw new Error("Ujian belum dimulai atau sudah selesai");
    // }

    return {
      id: participant.id,
    };
  }),

  getExam: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const participant = await db.participant.findFirst({
        where: {
          id: input.id,
        },
        include: {
          exam: true,
        },
      });

      if (!participant) {
        throw new Error("Participant not found");
      }

      return participant.exam;
    }),
});

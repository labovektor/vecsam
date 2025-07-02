import z from "zod";
import { createTRPCRouter, examProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const examRouter = createTRPCRouter({
  getSession: examProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getExam: examProcedure.query(({ ctx }) => {
    const examId = ctx.session.participant.examId;

    return ctx.db.exam.findFirst({
      where: {
        id: examId,
      },
      include: {
        sections: {
          include: { questions: true },
        },
      },
    });
  }),

  saveAnswer: examProcedure
    .input(
      z.object({
        questionId: z.string(),
        answer: z.object({
          answerText: z.string().optional(),
          answerFile: z.string().optional(),
          optionId: z.string().optional(),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { db, session } = ctx;

      //   Check if participant is locked
      if (session.participant.lockedAt) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Participant is locked",
        });
      }

      return db.participantAnswer.upsert({
        where: {
          participantId_questionId: {
            participantId: session.participantId,
            questionId: input.questionId,
          },
        },
        update: {
          answerText: input.answer.answerText,
          answerFile: input.answer.answerFile,
          optionId: input.answer.optionId,
        },
        create: {
          participantId: session.participantId,
          questionId: input.questionId,
          answerText: input.answer.answerText,
          answerFile: input.answer.answerFile,
          optionId: input.answer.optionId,
        },
      });
    }),

  lockAnswer: examProcedure.mutation(({ ctx }) => {
    const { db, session } = ctx;
    return db.participant.update({
      where: {
        id: session.participantId,
      },
      data: {
        lockedAt: new Date(),
      },
    });
  }),
});

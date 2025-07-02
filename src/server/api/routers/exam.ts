import z from "zod";
import { createTRPCRouter, examProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { supabaseAdminClient } from "@/lib/supabase/server";
import { Bucket } from "@/lib/supabase/bucket";

export const MAX_FILE_SIZE_FILE = 10 * 1024 * 1024;

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
          optionId: z.string().uuid().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const tmp = new Date().getTime().toString();

      //   Check if participant is locked
      if (session.participant.lockedAt) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Participant is locked",
        });
      }

      // Upload answer file  if provided
      let answerFileUrl: string | undefined = undefined;
      if (input.answer.answerFile) {
        const fileName = `answer-${session.participantId}-${input.questionId}.pdf`;
        const buffer = Buffer.from(input.answer.answerFile, "base64");

        if (buffer.byteLength > MAX_FILE_SIZE_FILE) {
          throw new Error("Ukuran gambar tidak boleh lebih dari 5MB");
        }

        const { data, error } = await supabaseAdminClient.storage
          .from(Bucket.ANSWER)
          .upload(fileName, buffer, {
            contentType: "application/pdf",
            cacheControl: "3600",
            upsert: true,
          });
        if (error) throw new Error(error.message);
        answerFileUrl = supabaseAdminClient.storage
          .from(Bucket.ANSWER)
          .getPublicUrl(data.path).data.publicUrl;
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
          answerFile: answerFileUrl ? `${answerFileUrl}?t=${tmp}` : undefined,
          optionId: input.answer.optionId,
        },
        create: {
          participantId: session.participantId,
          questionId: input.questionId,
          answerText: input.answer.answerText,
          answerFile: answerFileUrl ? `${answerFileUrl}?t=${tmp}` : undefined,
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

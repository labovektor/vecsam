import z from "zod";
import { createTRPCRouter, examProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { supabaseAdminClient } from "@/lib/supabase/server";
import { Bucket } from "@/lib/supabase/bucket";
import {
  saveAnswerSchema,
  type AnswerRecordSchemaType,
} from "@/features/exam/schema";
import { getRedisClient } from "@/lib/redis";
import { activityLogtype, appendActivityLog } from "@/lib/logger";

export const MAX_FILE_SIZE_FILE = 10 * 1024 * 1024;

export const examRouter = createTRPCRouter({
  getSession: examProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getExam: examProcedure.query(async ({ ctx }) => {
    const examId = ctx.session.participant.examId;
    const redis = getRedisClient();

    const examRedis = await redis.get(examId);
    if (examRedis) {
      return JSON.parse(examRedis);
    }

    const exam = await ctx.db.exam.findFirst({
      where: {
        id: examId,
      },
      include: {
        sections: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            questions: {
              include: {
                QuestionAttr: true,
                MultipleChoiceOption: true,
              },
              orderBy: {
                number: "asc",
              },
            },
          },
        },
      },
    });

    if (!exam) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Ujian tidak ditemukan",
      });
    }

    await appendActivityLog({
      examId,
      participantId: ctx.session.participant.id,
      type: "access_exam",
    });

    await redis.setex(examId, exam.duration * 60, JSON.stringify(exam));

    return exam;
  }),

  saveAnswer: examProcedure
    .input(
      z.object({
        questionId: z.string(),
        answer: saveAnswerSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const tmp = new Date().getTime().toString();

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

      await appendActivityLog({
        examId: session.participant.examId,
        participantId: session.participant.id,
        type: "add_answer",
        info: input.questionId,
      });

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

  getAnswers: examProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;

    const answers = await db.participantAnswer.findMany({
      where: {
        participantId: session.participantId,
      },
    });

    // Create records for each question
    const records: AnswerRecordSchemaType = {};
    answers.forEach((answer) => {
      records[answer.questionId] = {
        answerText: answer.answerText ?? undefined,
        answerFile: answer.answerFile ?? undefined,
        optionId: answer.optionId ?? undefined,
      };
    });

    return records;
  }),

  removeAnswer: examProcedure
    .input(z.object({ questionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      await appendActivityLog({
        examId: session.participant.examId,
        participantId: session.participant.id,
        type: "undo_answer",
        info: input.questionId,
      });

      return db.participantAnswer.delete({
        where: {
          participantId_questionId: {
            participantId: session.participantId,
            questionId: input.questionId,
          },
        },
      });
    }),

  lockAnswer: examProcedure.mutation(async ({ ctx }) => {
    const { db, session } = ctx;

    await appendActivityLog({
      examId: session.participant.examId,
      participantId: session.participant.id,
      type: "lock_answer",
    });
    return db.participant.update({
      where: {
        id: session.participantId,
      },
      data: {
        lockedAt: new Date(),
      },
    });
  }),

  appendAdditionalLog: examProcedure
    .input(
      z.object({
        type: activityLogtype,
        info: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await appendActivityLog({
        examId: ctx.session.participant.examId,
        participantId: ctx.session.participant.id,
        type: input.type,
        info: input.info,
      });
    }),
});

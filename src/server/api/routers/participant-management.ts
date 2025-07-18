import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { parse } from "csv-parse/sync";
import { addParticipantSchema } from "@/features/participant-management/schema";
import type { AnswerRecordSchemaType } from "@/features/exam/schema";

export const participantManagementRouter = createTRPCRouter({
  getAllByExamId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const { db } = ctx;
      return db.participant.findMany({
        where: {
          examId: input.id,
        },
        include: {
          participantSession: true,
        },
        orderBy: {
          name: "asc",
        },
      });
    }),

  add: protectedProcedure
    .input(
      z.object({
        examId: z.string(),
        data: addParticipantSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      return db.participant.create({
        data: {
          name: input.data.name,
          passcode: input.data.passcode,
          examId: input.examId,
        },
      });
    }),

  bulkAddFromCsv: protectedProcedure
    .input(
      z.object({
        csv: z.string(),
        examId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const records: any[] = parse(input.csv, {
        columns: true, // using first row as header
        skip_empty_lines: true,
        trim: true,
      });

      const invalidRows: number[] = [];
      const participantsToInsert: {
        name: string;
        passcode: string;
        examId: string;
      }[] = [];

      for (let i = 0; i < records.length; i++) {
        const row = records[i];

        const name = row.name?.toString().trim();
        const passcode = row.passcode?.toString();

        if (!name || !passcode) {
          invalidRows.push(i + 1);
          continue;
        }

        participantsToInsert.push({
          name,
          passcode,
          examId: input.examId,
        });
      }

      if (participantsToInsert.length === 0) {
        throw new Error("Semua baris tidak valid.");
      }

      if (invalidRows.length > 0) {
        throw new Error(`Baris ke ${invalidRows.join(", ")} tidak valid.`);
      }

      return db.participant.createMany({
        data: participantsToInsert,
      });
    }),

  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { db } = ctx;
      return db.participant.delete({
        where: {
          id: input.id,
        },
      });
    }),

  getAnswers: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const answers = await db.participantAnswer.findMany({
        where: {
          participantId: input.id,
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

  setScore: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        score: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      return db.participant.update({
        where: {
          id: input.id,
        },
        data: {
          score: input.score,
        },
      });
    }),
});

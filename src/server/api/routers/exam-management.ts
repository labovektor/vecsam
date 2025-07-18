import { examSchema } from "@/features/exam-management/schema";
import { getLogActivity } from "@/lib/logger";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { NotFoundError } from "@/use-cases/errors";
import { z } from "zod";

export const examManagementRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    const { db, user } = ctx;

    return db.exam.findMany({
      where: {
        userId: user?.id,
      },
    });
  }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const { db, user } = ctx;
      return db.exam.findFirst({
        where: {
          id: input.id,
          userId: user?.id,
        },
        include: {
          Participant: true,
          sections: {
            include: { questions: true },
          },
        },
      });
    }),

  create: protectedProcedure.input(examSchema).mutation(({ ctx, input }) => {
    const { db, user } = ctx;
    return db.exam.create({
      data: {
        userId: user!.id,
        ...input,
      },
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), value: examSchema }))
    .mutation(({ ctx, input }) => {
      const { db, user } = ctx;
      return db.exam.update({
        where: {
          id: input.id,
          userId: user?.id,
        },
        data: {
          ...input.value,
        },
      });
    }),

  toggleStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;

      const currentExam = await db.exam.findFirst({
        where: {
          id: input.id,
          userId: user?.id,
        },
        select: {
          isActive: true,
        },
      });

      if (!currentExam) {
        throw new NotFoundError();
      }

      return db.exam.update({
        where: {
          id: input.id,
        },
        data: {
          isActive: !currentExam.isActive,
        },
      });
    }),

  getLog: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const { error, data } = getLogActivity(input.id);
      if (error) {
        throw new Error(error);
      }
      return {
        filename: `${input.id}-logs.csv`,
        mimeType: "text/csv",
        content: data!,
      };
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { db, user } = ctx;
      return db.exam.delete({
        where: {
          id: input.id,
          userId: user?.id,
        },
      });
    }),
});

import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  addSectionSchema,
  updateSectionSchema,
} from "@/features/question/schema";
import type { SectionType } from "@prisma/client";

export const sectionRouter = createTRPCRouter({
  getSections: protectedProcedure
    .input(
      z.object({
        examId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const { db, user } = ctx;

      return db.section.findMany({
        where: {
          examId: input.examId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    }),
  addSection: protectedProcedure
    .input(addSectionSchema)
    .mutation(({ ctx, input }) => {
      const { db, user } = ctx;

      return db.section.create({
        data: {
          title: input.title,
          type: input.type as SectionType,
          points: input.points,
          examId: input.examId,
        },
      });
    }),

  updateSection: protectedProcedure
    .input(updateSectionSchema)
    .mutation(({ ctx, input }) => {
      const { db, user } = ctx;

      return db.section.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          type: input.type as SectionType,
          points: input.points,
        },
      });
    }),

  deleteSection: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { db, user } = ctx;

      return db.section.delete({
        where: {
          id: input.id,
        },
      });
    }),
});

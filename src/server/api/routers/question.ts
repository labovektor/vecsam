import {
  addQuestionSchema,
  addSectionSchema,
  updateSectionSchema,
} from "@/features/question/schema";
import { Bucket } from "@/lib/supabase/bucket";
import { createClient } from "@/lib/supabase/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { SectionType } from "@prisma/client";
import { z } from "zod";

export const questionRouter = createTRPCRouter({
  // Sections
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

  // Questions
  getQuestions: protectedProcedure
    .input(
      z.object({
        sectionId: z.string().nullable(),
      }),
    )
    .query(({ ctx, input }) => {
      const { db, user } = ctx;

      if (!input.sectionId) {
        return [];
      }

      return db.question.findMany({
        where: {
          sectionId: input.sectionId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    }),

  addQuestion: protectedProcedure
    .input(
      z.object({
        sectionId: z.string(),
        question: addQuestionSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const supabase = await createClient();

      const tmp = new Date().getTime().toString();

      // Upload question image if provided
      let questionImageUrl: string | undefined = undefined;
      if (input.question.image) {
        const fileName = `img-${crypto.randomUUID()}.jpeg`;
        const buffer = Buffer.from(input.question.image, "base64");
        const { data, error } = await supabase.storage
          .from(Bucket.QUESTION)
          .upload(fileName, buffer, {
            cacheControl: "3600",
            upsert: false,
          });
        if (error) throw new Error(error.message);
        questionImageUrl = supabase.storage
          .from(Bucket.QUESTION)
          .getPublicUrl(data.path).data.publicUrl;
      }

      // Create question first
      const question = await db.question.create({
        data: {
          text: input.question.text,
          image: questionImageUrl + "?t=" + tmp,
          sectionId: input.sectionId,
        },
      });

      // Upload QuestionAttr files and create if provided
      if (input.question.questionAttr) {
        const filesBuffer = Buffer.from(
          input.question.questionAttr.file,
          "base64",
        );
        const templateBuffer = Buffer.from(
          input.question.questionAttr.templateFile,
          "base64",
        );
        const [fileUpload, templateUpload] = await Promise.all([
          supabase.storage
            .from(Bucket.QUESTION_ATTRIBUTE)
            .upload(`files/${question.id}.pdf`, filesBuffer, {
              contentType: "application/pdf",
            }),
          supabase.storage
            .from(Bucket.QUESTION_ATTRIBUTE)
            .upload(`templates/${question.id}.pdf`, templateBuffer, {
              contentType: "application/pdf",
            }),
        ]);

        if (fileUpload.error) throw new Error(fileUpload.error.message);
        if (templateUpload.error) throw new Error(templateUpload.error.message);

        const fileUrl = supabase.storage
          .from(Bucket.QUESTION_ATTRIBUTE)
          .getPublicUrl(fileUpload.data.path).data.publicUrl;
        const templateUrl = supabase.storage
          .from(Bucket.QUESTION_ATTRIBUTE)
          .getPublicUrl(templateUpload.data.path).data.publicUrl;

        await db.questionAttr.create({
          data: {
            questionId: question.id,
            file: fileUrl + "?t=" + tmp,
            templateFile: templateUrl + "?t=" + tmp,
          },
        });
      }

      // Create MultipleChoiceOptions if provided
      if (input.question.multipleChoiceOptions?.length) {
        const optionData = await Promise.all(
          input.question.multipleChoiceOptions.map(async (option) => {
            let optionImageUrl: string | undefined;
            if (option.image) {
              const fileName = `img-${crypto.randomUUID()}.jpeg`;
              const buffer = Buffer.from(option.image, "base64");
              const { data, error } = await supabase.storage
                .from(Bucket.QUESTION)
                .upload(`options/${fileName}`, buffer);
              if (error) throw new Error(error.message);
              optionImageUrl = supabase.storage
                .from(Bucket.QUESTION)
                .getPublicUrl(data.path).data.publicUrl;
            }

            return {
              questionId: question.id,
              text: option.text,
              image: optionImageUrl + "?t=" + tmp,
            };
          }),
        );

        await db.multipleChoiceOption.createMany({
          data: optionData,
        });
      }

      return {
        success: true,
        id: question.id,
      };
    }),
});

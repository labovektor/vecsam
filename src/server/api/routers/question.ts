import {
  addMultipleChoiceOptionSchema,
  addQuestionSchema,
  editMultipleChoiceOptionSchema,
  editQuestionAttrSchema,
  editQuestionSchema,
} from "@/features/question/schema";
import { Bucket } from "@/lib/supabase/bucket";
import { supabaseAdminClient } from "@/lib/supabase/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { id } from "zod/v4/locales";

export const MAX_FILE_SIZE_IMAGE = 5 * 1024 * 1024;
export const MAX_FILE_SIZE_FILE = 10 * 1024 * 1024;

export const questionRouter = createTRPCRouter({
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
          number: "asc",
        },
        include: {
          MultipleChoiceOption: true,
          QuestionAttr: true,
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

      const tmp = new Date().getTime().toString();

      const questionId = crypto.randomUUID();

      return db.$transaction(async (tx) => {
        // Upload question image if provided
        let questionImageUrl: string | undefined = undefined;
        if (input.question.image) {
          const fileName = `img-${questionId}.jpeg`;
          const buffer = Buffer.from(input.question.image, "base64");

          if (buffer.byteLength > MAX_FILE_SIZE_IMAGE) {
            throw new Error("Ukuran gambar tidak boleh lebih dari 5MB");
          }

          const { data, error } = await supabaseAdminClient.storage
            .from(Bucket.QUESTION)
            .upload(fileName, buffer, {
              contentType: "image/jpeg",
              cacheControl: "3600",
              upsert: true,
            });
          if (error) throw new Error(error.message);
          questionImageUrl = supabaseAdminClient.storage
            .from(Bucket.QUESTION)
            .getPublicUrl(data.path).data.publicUrl;
        }

        // Create question first
        const question = await tx.question.create({
          data: {
            id: questionId,
            number: input.question.number,
            text: input.question.text,
            image: questionImageUrl
              ? `${questionImageUrl}?t=${tmp}`
              : undefined,
            sectionId: input.sectionId,
          },
        });

        // Upload QuestionAttr files and create if provided
        if (input.question.questionAttr) {
          const filesBuffer = Buffer.from(
            input.question.questionAttr.file,
            "base64",
          );

          if (filesBuffer.byteLength > MAX_FILE_SIZE_FILE) {
            throw new Error("Ukuran file tidak boleh lebih dari 10MB");
          }

          const templateBuffer = Buffer.from(
            input.question.questionAttr.templateFile,
            "base64",
          );

          if (templateBuffer.byteLength > MAX_FILE_SIZE_FILE) {
            throw new Error("Ukuran file tidak boleh lebih dari 10MB");
          }

          const [fileUpload, templateUpload] = await Promise.all([
            supabaseAdminClient.storage
              .from(Bucket.QUESTION_ATTRIBUTE)
              .upload(`files/${question.id}.pdf`, filesBuffer, {
                contentType: "application/pdf",
                cacheControl: "3600",
                upsert: true,
              }),
            supabaseAdminClient.storage
              .from(Bucket.QUESTION_ATTRIBUTE)
              .upload(`templates/${question.id}.pdf`, templateBuffer, {
                contentType: "application/pdf",
                cacheControl: "3600",
                upsert: true,
              }),
          ]);

          if (fileUpload.error) throw new Error(fileUpload.error.message);
          if (templateUpload.error)
            throw new Error(templateUpload.error.message);

          const fileUrl = supabaseAdminClient.storage
            .from(Bucket.QUESTION_ATTRIBUTE)
            .getPublicUrl(fileUpload.data.path).data.publicUrl;
          const templateUrl = supabaseAdminClient.storage
            .from(Bucket.QUESTION_ATTRIBUTE)
            .getPublicUrl(templateUpload.data.path).data.publicUrl;

          await tx.questionAttr.create({
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
              const id = crypto.randomUUID();
              if (option.image) {
                const fileName = `opt-${question.id}-${id}.jpeg`;
                const buffer = Buffer.from(option.image, "base64");
                if (buffer.byteLength > MAX_FILE_SIZE_IMAGE) {
                  throw new Error("Ukuran gambar tidak boleh lebih dari 5MB");
                }
                const { data, error } = await supabaseAdminClient.storage
                  .from(Bucket.QUESTION)
                  .upload(`options/${fileName}`, buffer, {
                    contentType: "image/jpeg",
                    cacheControl: "3600",
                    upsert: true,
                  });
                if (error) throw new Error(error.message);
                optionImageUrl = supabaseAdminClient.storage
                  .from(Bucket.QUESTION)
                  .getPublicUrl(data.path).data.publicUrl;
              }

              return {
                id,
                questionId: question.id,
                text: option.text,
                image: optionImageUrl
                  ? `${optionImageUrl}?t=${tmp}`
                  : undefined,
              };
            }),
          );

          await tx.multipleChoiceOption.createMany({
            data: optionData,
          });
        }
      });
    }),

  editQuestion: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        question: editQuestionSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;

      const tmp = new Date().getTime().toString();

      // Upload question image if provided
      let questionImageUrl: string | undefined = undefined;
      if (input.question.image) {
        const fileName = `img-${input.id}.jpeg`;
        const buffer = Buffer.from(input.question.image, "base64");

        if (buffer.byteLength > MAX_FILE_SIZE_IMAGE) {
          throw new Error("Ukuran gambar tidak boleh lebih dari 5MB");
        }

        const { data, error } = await supabaseAdminClient.storage
          .from(Bucket.QUESTION)
          .upload(fileName, buffer, {
            contentType: "image/jpeg",
            cacheControl: "3600",
            upsert: true,
          });
        if (error) throw new Error(error.message);
        questionImageUrl = supabaseAdminClient.storage
          .from(Bucket.QUESTION)
          .getPublicUrl(data.path).data.publicUrl;
      }

      return db.question.update({
        where: {
          id: input.id,
        },
        data: {
          text: input.question.text,
          number: input.question.number,
          image: questionImageUrl ? `${questionImageUrl}?t=${tmp}` : undefined,
        },
      });
    }),

  addMulitpleChoiceOption: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        option: addMultipleChoiceOptionSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;

      const tmp = new Date().getTime().toString();
      const id = crypto.randomUUID();

      let optionImageUrl: string | undefined;
      if (input.option.image) {
        const fileName = `opt-${input.questionId}-${id}.jpeg`;
        const buffer = Buffer.from(input.option.image, "base64");
        if (buffer.byteLength > MAX_FILE_SIZE_IMAGE) {
          throw new Error("Ukuran gambar tidak boleh lebih dari 5MB");
        }
        const { data, error } = await supabaseAdminClient.storage
          .from(Bucket.QUESTION)
          .upload(`options/${fileName}`, buffer, {
            contentType: "image/jpeg",
            cacheControl: "3600",
            upsert: true,
          });
        if (error) throw new Error(error.message);
        optionImageUrl = supabaseAdminClient.storage
          .from(Bucket.QUESTION)
          .getPublicUrl(data.path).data.publicUrl;
      }

      return db.multipleChoiceOption.create({
        data: {
          id,
          questionId: input.questionId,
          text: input.option.text,
          image: optionImageUrl ? `${optionImageUrl}?t=${tmp}` : undefined,
        },
      });
    }),

  editMultipleChoiceOption: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        id: z.string(),
        option: editMultipleChoiceOptionSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;

      const tmp = new Date().getTime().toString();

      let optionImageUrl: string | undefined;
      if (input.option.image) {
        const fileName = `opt-${input.questionId}-${input.id}.jpeg`;
        const buffer = Buffer.from(input.option.image, "base64");
        if (buffer.byteLength > MAX_FILE_SIZE_IMAGE) {
          throw new Error("Ukuran gambar tidak boleh lebih dari 5MB");
        }
        const { data, error } = await supabaseAdminClient.storage
          .from(Bucket.QUESTION)
          .upload(`options/${fileName}`, buffer, {
            contentType: "image/jpeg",
            cacheControl: "3600",
            upsert: true,
          });
        if (error) throw new Error(error.message);
        optionImageUrl = supabaseAdminClient.storage
          .from(Bucket.QUESTION)
          .getPublicUrl(data.path).data.publicUrl;
      }

      return db.multipleChoiceOption.update({
        where: {
          id: input.id,
        },
        data: {
          text: input.option.text,
          image: optionImageUrl ? `${optionImageUrl}?t=${tmp}` : undefined,
        },
      });
    }),

  editQuestionAttr: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        type: z.enum(["file", "templateFile"]),
        attr: editQuestionAttrSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;

      const filesBuffer = Buffer.from(input.attr.file, "base64");

      const tmp = new Date().getTime().toString();

      if (filesBuffer.byteLength > MAX_FILE_SIZE_FILE) {
        throw new Error("Ukuran file tidak boleh lebih dari 10MB");
      }

      if (input.type === "file") {
        const { data, error } = await supabaseAdminClient.storage
          .from(Bucket.QUESTION)
          .upload(`files/${input.questionId}.pdf`, filesBuffer, {
            contentType: "application/pdf",
            cacheControl: "3600",
            upsert: true,
          });
        if (error) throw new Error(error.message);
        const fileUrl = supabaseAdminClient.storage
          .from(Bucket.QUESTION)
          .getPublicUrl(data.path).data.publicUrl;

        return db.question.update({
          where: {
            id: input.questionId,
          },
          data: {
            QuestionAttr: {
              upsert: {
                update: {
                  file: `${fileUrl}?t=${tmp}`,
                },
                create: {
                  file: `${fileUrl}?t=${tmp}`,
                },
              },
            },
          },
        });
      }

      if (input.type === "templateFile") {
        const { data, error } = await supabaseAdminClient.storage
          .from(Bucket.QUESTION)
          .upload(`templates/${input.questionId}.docx`, filesBuffer, {
            contentType: "application/pdf",
            cacheControl: "3600",
            upsert: true,
          });
        if (error) throw new Error(error.message);
        const fileUrl = supabaseAdminClient.storage
          .from(Bucket.QUESTION)
          .getPublicUrl(data.path).data.publicUrl;

        return db.question.update({
          where: {
            id: input.questionId,
          },
          data: {
            QuestionAttr: {
              upsert: {
                create: {
                  templateFile: `${fileUrl}?t=${tmp}`,
                },
                update: {
                  templateFile: `${fileUrl}?t=${tmp}`,
                },
              },
            },
          },
        });
      }
    }),

  deleteMultipleChoiceOption: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { db, user } = ctx;
      return db.multipleChoiceOption.delete({
        where: {
          id: input.id,
        },
      });
    }),

  deleteQuestion: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { db, user } = ctx;
      return db.question.delete({
        where: {
          id: input.id,
        },
      });
    }),
});

import { z } from "zod";

export const examSchema = z
  .object({
    title: z.string().min(3),
    description: z.string(),
    passcode: z.string().length(6),
    startTime: z.date({ coerce: true }),
    endTime: z.date({ coerce: true }),
    duration: z
      .number({ coerce: true })
      .min(10, "Duration must be at least 10 minutes"),
  })
  .refine(
    (data) =>
      data.endTime.getTime() - data.startTime.getTime() >= 10 * 60 * 1000,
    {
      message: "End time must be at least 10 minutes after start time",
      path: ["endTime"],
    }
  )
  .refine(
    (data) =>
      data.duration * 60 * 1000 <=
      data.endTime.getTime() - data.startTime.getTime(),
    {
      message:
        "Duration must fit within the time range between start and end time",
      path: ["duration"],
    }
  );

export type ExamSchemaType = z.infer<typeof examSchema>;

export type ExamRes = ExamSchemaType & {
  id: string;
  isActive: boolean;
};

import fs from "fs";
import path from "path";
import { formatISO } from "date-fns";
import z from "zod";
import { error } from "console";

export const activityLogtype = z.enum([
  "leave_tab",
  "add_answer",
  "undo_answer",
  "lock_answer",
  "access_exam",
  "login_exam",
  "finish_exam",
  "start_exam",
  "rejoin_exam",
]);

export async function appendActivityLog({
  examId,
  participantId,
  type,
  info,
}: {
  examId: string;
  participantId: string;
  type: z.infer<typeof activityLogtype>;
  info?: string;
}) {
  const timestamp = formatISO(new Date());
  const line = `${participantId},${type},${timestamp},"${info ?? ""}"\n`;

  const logsDir = path.resolve("logs");
  const filePath = path.resolve(logsDir, `${examId}.csv`);

  try {
    await fs.promises.mkdir(logsDir, { recursive: true });

    const fileExists = fs.existsSync(filePath);

    if (!fileExists) {
      const header = "participant_id,type,timestamp,info\n";
      await fs.promises.writeFile(filePath, header + line, { flag: "w" });
    } else {
      await fs.promises.appendFile(filePath, line);
    }
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

export function getLogActivity(examId: string) {
  const filePath = path.resolve("logs", `${examId}.csv`);

  if (!fs.existsSync(filePath)) {
    return { error: "File log tidak ditemukan" };
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return { data };
}

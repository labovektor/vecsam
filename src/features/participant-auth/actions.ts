"use server";

import { db } from "@/server/db";
import type { LoginSchemaType } from "./schema";
import { addMinutes, isBefore } from "date-fns";
import { createJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function loginAction(input: LoginSchemaType) {
  const c = await cookies();
  const participant = await db.participant.findFirst({
    where: {
      passcode: input.participantCode,
    },
    include: {
      exam: true,
      participantSession: true,
    },
  });

  if (!participant || participant.exam.passcode !== input.examCode) {
    return {
      error: "Kode tidak valid",
    };
  }

  const now = new Date();

  // Validate if exam is still axtive and not yet ended
  if (!participant.exam.isActive) {
    return {
      error: "Ujian tidak tersedia",
    };
  }
  if (
    isBefore(now, participant.exam.startTime) ||
    isBefore(participant.exam.endTime, now)
  ) {
    throw new Error("Ujian belum dimulai atau sudah selesai");
  }

  const defaultExpire = addMinutes(now, participant.exam.duration);
  const endTime = new Date(participant.exam.endTime);

  // Validate if participant is already logged in
  if (!participant.participantSession) {
    const expiredAt = isBefore(defaultExpire, endTime)
      ? defaultExpire
      : endTime;
    const expiresIn = Math.floor((expiredAt.getTime() - now.getTime()) / 1000);

    const token = createJwt(participant.id, participant.examId, expiresIn);

    await db.participantSession.create({
      data: {
        participantId: participant.id,
        token,
        expiredAt,
      },
    });

    c.set("xt_val", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return { data: { expiredAt } };
  } else {
    const expiresIn = Math.floor(
      (participant.participantSession.expiredAt.getTime() - now.getTime()) /
        1000,
    );

    const token = createJwt(participant.id, participant.examId, expiresIn);
    await db.participantSession.update({
      where: { participantId: participant.id },
      data: {
        token,
      },
    });

    c.set("xt_val", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return { data: { expiredAt: participant.participantSession.expiredAt } };
  }
}

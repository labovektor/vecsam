"use server";

import { db } from "@/server/db";
import { addMinutes, isBefore } from "date-fns";
import { createJwt } from "@/lib/jwt";
import { cookies } from "next/headers";
import { appendActivityLog } from "@/lib/logger";

export async function loginAction(input: { participantId: string }) {
  const c = await cookies();
  const participant = await db.participant.findFirst({
    where: {
      id: input.participantId,
    },
    include: {
      exam: true,
      participantSession: true,
    },
  });

  if (!participant) {
    return {
      error: "Terdapat kesalahan",
    };
  }

  const now = new Date();

  // Validate if participant is locked
  if (participant.lockedAt) {
    return {
      error: "Anda sudah mengerjakan ujian ini",
    };
  }

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
    return {
      error: "Ujian belum dimulai atau sudah selesai",
    };
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

    await appendActivityLog({
      examId: participant.examId,
      participantId: participant.id,
      type: "start_exam",
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

    console.log("expiresIn", expiresIn);

    if (expiresIn <= 0) {
      return {
        error: "Waktu pengerjaanmu telah habis",
      };
    }

    const token = createJwt(participant.id, participant.examId, expiresIn);
    await db.participantSession.update({
      where: { participantId: participant.id },
      data: {
        token,
      },
    });

    await appendActivityLog({
      examId: participant.examId,
      participantId: participant.id,
      type: "rejoin_exam",
    });

    c.set("xt_val", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return { data: { expiredAt: participant.participantSession.expiredAt } };
  }
}

export async function logoutAction() {
  const c = await cookies();
  c.delete("xt_val");
}

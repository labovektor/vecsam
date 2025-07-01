"server-only";

import jwt from "jsonwebtoken";

export function createJwt(
  participantId: string,
  examId: string,
  expiresIn: number,
) {
  return jwt.sign({ sub: participantId, examId }, process.env.JWT_SECRET!, {
    expiresIn,
  });
}

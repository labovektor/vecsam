"use client";

import type { Exam, Participant } from "@prisma/client";
import type { SaveAnswerSchemaType } from "../schema";
import { createContext, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/trpc/react";

type ExamContextProviderProps = {
  children: React.ReactNode;
};

interface IExamContext {
  participant: Participant | null;
  exam: Exam | null;
  expiredAt: Date;
  focusedQuestion: string;
  setFocusedQuestion: React.Dispatch<React.SetStateAction<string>>;
  saveAnswer: (questionId: string, answer: SaveAnswerSchemaType) => void;
  lockAnswer: VoidFunction;
  isSaving: boolean;
}

export const ExamContext = createContext<IExamContext>({} as IExamContext);

export default function ExamProvider({ children }: ExamContextProviderProps) {
  const [focusedQuestion, setFocusedQuestion] = useState("awokawaok");
  const queryClient = useQueryClient();

  const { data: participant } = api.exam.getSession.useQuery();
  const { data: exam } = api.exam.getExam.useQuery();

  const memoedValue: IExamContext = useMemo(
    () => ({
      participant: participant?.participant || null,
      exam: exam || null,
      expiredAt: new Date(),
      focusedQuestion: focusedQuestion,
      setFocusedQuestion: setFocusedQuestion,
      saveAnswer: (questionId: string, answer: SaveAnswerSchemaType) => {
        queryClient.setQueryData(["answers", questionId], answer);
      },
      lockAnswer: () => {
        queryClient.setQueryData(["isCreating"], false);
      },
      isSaving: false,
    }),
    [participant, exam],
  );
  return (
    <ExamContext.Provider value={memoedValue}>{children}</ExamContext.Provider>
  );
}

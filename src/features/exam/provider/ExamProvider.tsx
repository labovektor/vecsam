"use client";

import type { Exam, Participant, ParticipantAnswer } from "@prisma/client";
import type { SaveAnswerSchemaType } from "../schema";
import { createContext, useMemo, useState } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type ExamContextProviderProps = {
  children: React.ReactNode;
};

interface IExamContext {
  error: string | null;
  participant: Participant | null;
  exam: Exam | null;
  answers: ParticipantAnswer[];
  expiredAt: Date | null;
  focusedQuestion: string | null;
  setFocusedQuestion: React.Dispatch<React.SetStateAction<string | null>>;
  saveAnswer: (questionId: string, answer: SaveAnswerSchemaType) => void;
  lockAnswer: VoidFunction;
  isSaving: boolean;
}

export const ExamContext = createContext<IExamContext>({} as IExamContext);

/**
 * The ExamProvider is a React Context Provider that provides access to the
 * current exam, participant, and answers. It also provides functions to save
 * answers and lock the participant's answers.
 *
 * The ExamProvider is used to wrap the exam page, and should be used
 * to access the exam state from any component inside exam page.
 *
 * @example
 * import { ExamProvider } from "@/features/exam/provider/ExamProvider";
 *
 * function App() {
 *   return (
 *     <ExamProvider>
 *       <YourApp />
 *     </ExamProvider>
 *   );
 * }
 *
 * @example
 * import { useContext } from "react";
 * import { ExamContext } from "@/features/exam/provider/ExamProvider";
 *
 * function YourComponent() {
 *   const { exam, participant, answers } = useContext(ExamContext);
 *
 *   return (
 *     <div>
 *       <h1>{exam.title}</h1>
 *       <p>Participant: {participant.name}</p>
 *       <p>Answers: {answers.length}</p>
 *     </div>
 *   );
 * }
 */
export default function ExamProvider({ children }: ExamContextProviderProps) {
  const [focusedQuestion, setFocusedQuestion] = useState<string | null>(null);

  const { data: session, error: sessionError } = api.exam.getSession.useQuery();
  const { data: exam, error: examError } = api.exam.getExam.useQuery();
  const {
    data: answers,
    error: answersError,
    refetch: refetchAnswers,
  } = api.exam.getAnswers.useQuery();

  if (exam && !focusedQuestion) {
    const firstNumber = exam.sections[0]?.questions[0];
    if (firstNumber) {
      setFocusedQuestion(firstNumber.id);
    }
  }

  const saveAnswer = api.exam.saveAnswer.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      refetchAnswers();
    },
  });

  const lockAnswer = api.exam.lockAnswer.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const memoedValue: IExamContext = useMemo(
    () => ({
      error:
        sessionError?.message ||
        examError?.message ||
        answersError?.message ||
        null,
      participant: session?.participant || null,
      exam: exam || null,
      answers: answers || [],
      expiredAt: session?.expiredAt || null,
      focusedQuestion: focusedQuestion,
      setFocusedQuestion: setFocusedQuestion,
      saveAnswer: (questionId: string, answer: SaveAnswerSchemaType) => {
        saveAnswer.mutate({ questionId, answer });
      },
      lockAnswer: () => {
        lockAnswer.mutate();
      },
      isSaving: saveAnswer.isPending,
    }),
    [session, exam, sessionError, examError],
  );
  return (
    <ExamContext.Provider value={memoedValue}>{children}</ExamContext.Provider>
  );
}

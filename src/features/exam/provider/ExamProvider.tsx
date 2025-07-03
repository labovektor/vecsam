"use client";

import type {
  Exam,
  Participant,
  ParticipantAnswer,
  Question,
  Section,
} from "@prisma/client";
import type { SaveAnswerSchemaType } from "../schema";
import { createContext, useEffect, useMemo, useState } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type ExamContextProviderProps = {
  children: React.ReactNode;
};

interface IExamContext {
  error: string | null;
  participant: Participant | null;
  exam: (Exam & { sections: (Section & { questions: Question[] })[] }) | null;
  answers: ParticipantAnswer[];
  expiredAt: Date | null;
  focusedSection: Section | null;
  setFocusedSection: React.Dispatch<
    React.SetStateAction<(Section & { questions: Question[] }) | null>
  >;
  focusedQuestion: Question | null;
  setFocusedQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
  setFocusedBefore: VoidFunction;
  setFocusedAfter: VoidFunction;
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
  const [focusedSection, setFocusedSection] = useState<
    (Section & { questions: Question[] }) | null
  >(null);
  const [focusedQuestion, setFocusedQuestion] = useState<Question | null>(null);

  const { data: session, error: sessionError } = api.exam.getSession.useQuery();
  const { data: exam, error: examError } = api.exam.getExam.useQuery();
  const {
    data: answers,
    error: answersError,
    refetch: refetchAnswers,
  } = api.exam.getAnswers.useQuery();

  if (exam && !focusedQuestion) {
    const firstSection = exam.sections[0];
    if (firstSection) {
      setFocusedSection(firstSection);
      const firstNumber = firstSection.questions[0];
      if (firstNumber) {
        setFocusedQuestion(firstNumber);
      }
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

  const setFocusedBefore = () => {
    if (!exam || !focusedQuestion || !focusedSection) return;

    const questionIndex = focusedSection.questions.findIndex(
      (q) => q.id === focusedQuestion.id,
    );
    if (questionIndex <= 0) return;

    const prevQuestion = focusedSection.questions[questionIndex - 1];
    if (!prevQuestion) return;
    setFocusedQuestion(prevQuestion);
  };

  const setFocusedAfter = () => {
    if (!exam || !focusedQuestion || !focusedSection) return;

    const questionIndex = focusedSection.questions.findIndex(
      (q) => q.id === focusedQuestion.id,
    );
    if (questionIndex >= focusedSection.questions.length - 1) return;

    const nextQuestion = focusedSection.questions[questionIndex + 1];
    if (!nextQuestion) return;
    setFocusedQuestion(nextQuestion);
  };

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
      focusedSection,
      setFocusedSection,
      focusedQuestion: focusedQuestion,
      setFocusedQuestion,
      setFocusedBefore,
      setFocusedAfter,
      saveAnswer: (questionId: string, answer: SaveAnswerSchemaType) => {
        saveAnswer.mutate({ questionId, answer });
      },
      lockAnswer: () => {
        lockAnswer.mutate();
      },
      isSaving: saveAnswer.isPending,
    }),
    [session, exam, sessionError, examError, focusedQuestion],
  );
  return (
    <ExamContext.Provider value={memoedValue}>{children}</ExamContext.Provider>
  );
}

"use client";

import type { Participant } from "@prisma/client";
import type { AnswerRecordSchemaType, SaveAnswerSchemaType } from "../schema";
import { createContext, useMemo, useState } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import type {
  ExamWithSectionQuestionAttr,
  QuestionWithAttr,
  SectionWithQuestionAttr,
} from "../types";
import { Loader } from "lucide-react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/features/participant-auth/actions";

type ExamContextProviderProps = {
  children: React.ReactNode;
};

interface IExamContext {
  error: string | null;
  participant: Participant | null;
  exam: ExamWithSectionQuestionAttr | null;
  answers: AnswerRecordSchemaType;
  expiredAt: Date | null;
  focusedSection: SectionWithQuestionAttr | null;
  setFocusedSection: React.Dispatch<
    React.SetStateAction<SectionWithQuestionAttr | null>
  >;
  focusedQuestion: QuestionWithAttr | null;
  setFocusedQuestion: React.Dispatch<
    React.SetStateAction<QuestionWithAttr | null>
  >;
  setFocusedBefore: VoidFunction;
  setFocusedAfter: VoidFunction;
  saveAnswer: (questionId: string, answer: SaveAnswerSchemaType) => void;
  undoAnswer: (questionId: string) => void;
  lockAnswer: VoidFunction;
  isSaving: boolean;
}

/**
 * The ExamContext is a React Context that provides access to the current exam,
 * participant, and answers. It also provides functions to save answers and lock
 * the participant's answers.
 *
 * The ExamContext is used to access the exam state from any component inside
 * the exam page.
 */
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
  const router = useRouter();
  const [focusedSection, setFocusedSection] =
    useState<SectionWithQuestionAttr | null>(null);
  const [focusedQuestion, setFocusedQuestion] =
    useState<QuestionWithAttr | null>(null);

  const {
    data: session,
    error: sessionError,
    isFetching: isFetchingSession,
  } = api.exam.getSession.useQuery();
  const {
    data: exam,
    error: examError,
    isFetching: isFetchingExam,
  } = api.exam.getExam.useQuery();
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

  const undoAnswer = api.exam.removeAnswer.useMutation({
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
    onSuccess: () =>
      logoutAction()
        .then(() => {
          router.replace("/bye-bye");
        })
        .catch((err) => {
          toast.error(err.message);
        }),
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
      answers: answers || {},
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
      undoAnswer: (questionId: string) => {
        undoAnswer.mutate({ questionId });
      },
      lockAnswer: () => {
        lockAnswer.mutate();
      },
      isSaving:
        saveAnswer.isPending || undoAnswer.isPending || lockAnswer.isPending,
    }),
    [
      session,
      exam,
      sessionError,
      examError,
      focusedQuestion,
      saveAnswer.isPending,
      undoAnswer.isPending,
      lockAnswer.isPending,
      answers,
    ],
  );
  return (
    <ExamContext.Provider value={memoedValue}>
      {children}
      {(isFetchingSession || isFetchingExam) && (
        <AlertDialog open>
          <AlertDialogContent>
            <Loader className="mx-auto animate-spin" />
            <AlertDialogTitle className="text-center">
              Memuat...
            </AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </ExamContext.Provider>
  );
}

import { ExamContext } from "@/features/exam/provider/ExamProvider";
import { useContext } from "react";

/**
 * React hook to access the ExamContext.
 *
 * @returns The ExamContext that was passed to the ExamProvider.
 *
 * @throws If the hook is called outside of an ExamProvider.
 */
export function useExam() {
  const context = useContext(ExamContext);

  if (!context) {
    throw new Error("The App Context must be used within an ExamProvider");
  }

  return context;
}

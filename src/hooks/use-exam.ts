import { ExamContext } from "@/features/exam/provider/ExamProvider";
import { useContext } from "react";

export function useExam() {
  const context = useContext(ExamContext);

  if (!context) {
    throw new Error("The App Context must be used within an ExamProvider");
  }

  return context;
}

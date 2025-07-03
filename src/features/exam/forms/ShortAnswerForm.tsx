"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExam } from "@/hooks/use-exam";
import React from "react";

const ShortAnswerForm = () => {
  const { focusedQuestion, saveAnswer, answers, isSaving } = useExam();
  const cAnswer = focusedQuestion
    ? (answers[focusedQuestion?.id]?.answerText ?? "")
    : "";
  const [value, setValue] = React.useState(cAnswer);

  return (
    <div className="flex gap-2">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        disabled={isSaving || value === cAnswer}
        onClick={() => {
          if (!focusedQuestion) return;
          saveAnswer(focusedQuestion.id, { answerText: value });
        }}
      >
        Simpan
      </Button>
    </div>
  );
};

export default ShortAnswerForm;

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExam } from "@/hooks/use-exam";
import { Check } from "lucide-react";
import React from "react";

const ShortAnswerForm = () => {
  const { focusedQuestion, saveAnswer, answers, isSaving } = useExam();
  const cAnswer = focusedQuestion
    ? (answers[focusedQuestion?.id]?.answerText ?? "")
    : "";
  const [value, setValue] = React.useState(cAnswer);

  React.useEffect(() => {
    setValue(cAnswer);
  }, [cAnswer]);

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="max-w-md"
      />
      <Button
        disabled={isSaving || value === cAnswer}
        size="icon"
        onClick={() => {
          if (!focusedQuestion) return;
          saveAnswer(focusedQuestion.id, { answerText: value });
        }}
      >
        <Check />
      </Button>
    </div>
  );
};

export default ShortAnswerForm;

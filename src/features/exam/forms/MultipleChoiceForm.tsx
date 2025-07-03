"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useExam } from "@/hooks/use-exam";
import { renderKatexFromHtml } from "@/lib/katex-utils";
import debounce from "lodash.debounce";

const MultipleChoiceForm = () => {
  const { focusedQuestion, saveAnswer, answers, isSaving } = useExam();
  const cValue = focusedQuestion
    ? (answers[focusedQuestion.id]?.optionId ?? null)
    : null;

  const [value, setValue] = React.useState(cValue);

  const handleValueChange = debounce((value) => {
    if (!focusedQuestion) return;
    saveAnswer(focusedQuestion.id, { optionId: value });
  }, 1000);

  React.useEffect(() => {
    setValue(cValue);
  }, [cValue]);
  return (
    <RadioGroup
      disabled={isSaving}
      value={value}
      onValueChange={(value) => {
        setValue(value);
        handleValueChange(value);
      }}
    >
      {focusedQuestion?.MultipleChoiceOption.map((option) => (
        <div key={option.id} className="flex items-center gap-3">
          <RadioGroupItem value={option.id} id={option.id} />
          <Label htmlFor={option.id} className="flex flex-col">
            <span
              dangerouslySetInnerHTML={{
                __html: renderKatexFromHtml(option.text || ""),
              }}
            />
            {option.image && (
              <img
                src={option.image}
                alt="question image"
                className="max-h-36"
              />
            )}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default MultipleChoiceForm;

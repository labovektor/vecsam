"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useExam } from "@/hooks/use-exam";
import { renderKatexFromHtml } from "@/lib/katex-utils";
import debounce from "lodash.debounce";
import Image from "next/image";

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
        <div key={option.id} className="flex items-start gap-3">
          <RadioGroupItem value={option.id} id={option.id} />
          <Label
            htmlFor={option.id}
            className="flex flex-col items-start text-start"
          >
            <span
              dangerouslySetInnerHTML={{
                __html: renderKatexFromHtml(option.text ?? ""),
              }}
            />
            {option.image && (
              <Image
                priority
                width={200}
                height={144}
                objectFit="contain"
                src={option.image}
                alt={option.id}
                className="max-h-36 object-contain"
              />
            )}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default MultipleChoiceForm;

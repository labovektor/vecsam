"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExam } from "@/hooks/use-exam";
import { fileToBase64 } from "@/lib/form-utils";
import React from "react";

const FileAnswerForm = () => {
  const [value, setValue] = React.useState<string>();
  const { focusedQuestion, saveAnswer, answers, isSaving } = useExam();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setValue(base64);
    }
  };
  return (
    <>
      <div className="flex gap-2">
        <Input onChange={handleChange} type="file" disabled={isSaving} />
        <Button
          disabled={isSaving || !value}
          onClick={() => {
            if (!focusedQuestion) return;
            saveAnswer(focusedQuestion.id, { answerFile: value });
            setValue(undefined);
          }}
        >
          Simpan
        </Button>
      </div>
      <span>Jawaban Saat Ini: </span>
      {focusedQuestion && answers[focusedQuestion?.id]?.answerFile ? (
        <a
          href={answers[focusedQuestion?.id]?.answerFile}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Lihat Jawaban
        </a>
      ) : (
        "-"
      )}
    </>
  );
};

export default FileAnswerForm;

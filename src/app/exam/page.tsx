"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

import SavingIndicator from "@/features/exam/components/SavingIndicator";
import FileAnswerForm from "@/features/exam/forms/FileAnswerForm";
import MultipleChoiceForm from "@/features/exam/forms/MultipleChoiceForm";
import ShortAnswerForm from "@/features/exam/forms/ShortAnswerForm";
import { useExam } from "@/hooks/use-exam";
import { renderKatexFromHtml } from "@/lib/katex-utils";
import { Undo } from "lucide-react";

import React from "react";

const ExamPage = () => {
  const { focusedQuestion, focusedSection, isSaving, answers, undoAnswer } =
    useExam();
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <CardTitle className="line-clamp-1">{focusedSection?.title}</CardTitle>
        <SavingIndicator isSaving={isSaving} />
      </div>
      {focusedSection && (
        <div className="flex gap-2">
          <Badge variant="default">
            Poin Benar: {focusedSection.correctPoint}
          </Badge>
          <Badge variant="destructive">
            Poin Salah: {focusedSection.wrongPoint}
          </Badge>
          <Badge variant="secondary">
            Poin Dikosongi: {focusedSection.passPoint}
          </Badge>
        </div>
      )}
      <Card>
        <CardContent className="flex gap-3">
          <span>{focusedQuestion?.number}.</span>
          <div className="flex-1">
            <span
              dangerouslySetInnerHTML={{
                __html: renderKatexFromHtml(focusedQuestion?.text || ""),
              }}
            />
            {focusedQuestion?.image && (
              <img
                src={focusedQuestion.image}
                alt="question image"
                className="max-h-36"
              />
            )}
          </div>
          {focusedSection?.type === "FILE_ANSWER" && (
            <>
              {focusedQuestion?.QuestionAttr?.file && (
                <a
                  className={buttonVariants({ variant: "default" })}
                  href={focusedQuestion.QuestionAttr.file}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Unduh Pertanyaan
                </a>
              )}
              {focusedQuestion?.QuestionAttr?.templateFile && (
                <a
                  className={buttonVariants({ variant: "default" })}
                  href={focusedQuestion.QuestionAttr.templateFile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Unduh Template Jawaban
                </a>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <div className="flex items-center gap-3">
        <h3 className="font-semibold">Jawaban:</h3>
        {focusedQuestion && answers[focusedQuestion?.id] && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => undoAnswer(focusedQuestion.id)}
            disabled={isSaving}
          >
            <Undo /> Urungkan Jawaban
          </Button>
        )}
      </div>
      {focusedSection?.type === "MULTIPLE_CHOICE" && <MultipleChoiceForm />}
      {focusedSection?.type === "SHORT_ANSWER" && (
        <ShortAnswerForm key={focusedQuestion?.id} />
      )}
      {focusedSection?.type === "FILE_ANSWER" && (
        <FileAnswerForm key={focusedQuestion?.id} />
      )}
    </div>
  );
};

export default ExamPage;

"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { useExam } from "@/hooks/use-exam";
import { renderKatexFromHtml } from "@/lib/katex-utils";
import React from "react";

const ExamPage = () => {
  const { focusedQuestion } = useExam();
  return (
    <div>
      <Card>
        <CardHeader className="flex gap-3">
          <span>{focusedQuestion?.number}. </span>
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
        </CardHeader>
      </Card>
    </div>
  );
};

export default ExamPage;

"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import type { Section } from "@prisma/client";
import { AlertCircle, LoaderCircle, Plus } from "lucide-react";
import React from "react";
import AddQuestionForm from "../form/AddQuestionForm";
import QuestionCard from "./QuestionCard";

const QuestionsTab = ({
  section,
  className,
}: {
  section: Section | null;
  className?: string;
}) => {
  const {
    data: questions,
    error,
    isLoading,
  } = api.question.getQuestions.useQuery({
    sectionId: section?.id ?? null,
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div
      className={cn("flex h-full flex-col gap-2 overflow-y-hidden", className)}
    >
      {!section && (
        <CardDescription className="text-center">
          Please select a section to view questions
        </CardDescription>
      )}

      {section && (
        <>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="line-clamp-1">{section.title}</CardTitle>
            <AddQuestionForm
              sectionId={section.id}
              sectionType={section.type}
            />
          </div>
          <ScrollArea
            type="always"
            className="h-[calc(100svh-14rem)] scroll-m-2"
          >
            {isLoading && (
              <div className="flex w-full items-center justify-center">
                <LoaderCircle className="animate-spin" />
              </div>
            )}
            {!isLoading && (
              <div className="flex flex-col gap-2">
                {questions?.map((question) => (
                  <QuestionCard
                    key={question.id}
                    sectionType={section.type}
                    question={question}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </>
      )}
    </div>
  );
};

export default QuestionsTab;

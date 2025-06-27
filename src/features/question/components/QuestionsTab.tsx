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
    refetch,
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
    <div className={cn("flex h-full flex-col gap-2", className)}>
      <ScrollArea className="h-[calc(100svh-14rem)] scroll-m-2">
        {!section && (
          <CardDescription>
            Please select a section to view questions
          </CardDescription>
        )}
        {isLoading && (
          <div className="flex w-full items-center justify-center">
            <LoaderCircle className="animate-spin" />
          </div>
        )}
        {section && !isLoading && (
          <div>
            {questions?.map((question) => (
              <div key={question.id}>{question.text}</div>
            ))}
            <AddQuestionForm
              sectionId={section.id}
              sectionType={section.type}
            />
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default QuestionsTab;

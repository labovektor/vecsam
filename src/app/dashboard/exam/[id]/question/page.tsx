"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/trpc/react";
import { AlertCircle } from "lucide-react";
import React, { use } from "react";

const QuestionManagementPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const { data: exam, error } = api.exam.getById.useQuery({ id });
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return <div>QuestionManagementPage</div>;
};

export default QuestionManagementPage;

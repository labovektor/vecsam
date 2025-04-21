"use client";

import { CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SectionTab from "@/features/question/components/SectionTab";
import { api } from "@/trpc/react";
import React, { use } from "react";

const QuestionManagementPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);

  const { data: exam, error } = api.exam.getById.useQuery({
    id: id,
  });

  return (
    <div>
      <CardTitle className="text-xl">
        Question Management - {exam?.title}
      </CardTitle>
      <div className="flex">
        <div className="flex-1">
          <SectionTab examId={id} />
        </div>
        <Separator orientation="vertical" />
        <div className="flex-[3]"></div>
      </div>
    </div>
  );
};

export default QuestionManagementPage;

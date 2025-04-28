"use client";

import { CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import QuestionsTab from "@/features/question/components/QuestionsTab";
import SectionTab from "@/features/question/components/SectionTab";
import React, { use } from "react";

const QuestionManagementPage = ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { id } = use(params);
  const { exam_name } = use(searchParams);

  const [selectedSection, setSelectedSection] = React.useState<string | null>(
    null,
  );

  return (
    <div className="flex h-full flex-col">
      <CardTitle className="text-xl">
        Question Management - {exam_name}
      </CardTitle>
      <Separator className="my-3" />
      <div className="flex h-full gap-4">
        <div className="h-full flex-1">
          <SectionTab
            examId={id}
            className="h-full"
            onSelected={setSelectedSection}
          />
        </div>

        <div className="flex-[3]">
          <QuestionsTab sectionId={selectedSection} />
        </div>
      </div>
    </div>
  );
};

export default QuestionManagementPage;

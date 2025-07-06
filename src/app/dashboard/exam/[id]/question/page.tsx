"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import QuestionsTab from "@/features/question/components/QuestionsTab";
import SectionTab from "@/features/question/components/SectionTab";
import type { Section } from "@prisma/client";
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

  const [selectedSection, setSelectedSection] = React.useState<Section | null>(
    null,
  );

  return (
    <div className="flex h-full flex-col gap-2">
      <CardTitle className="text-xl">
        Manajemen Pertanyaan - {exam_name}
      </CardTitle>
      <Card className="h-full bg-white">
        <CardContent className="flex gap-3">
          <div className="h-full flex-1">
            <SectionTab
              examId={id}
              className="h-full"
              onSelected={setSelectedSection}
              selectedSectionId={selectedSection?.id ?? null}
            />
          </div>

          <div className="flex-[3]">
            <QuestionsTab section={selectedSection} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionManagementPage;

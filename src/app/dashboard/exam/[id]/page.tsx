"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ExamStatCard from "@/features/exam-management/components/stat-card";
import ToggleExamStatus from "@/features/exam-management/forms/ToggleExamStatus";
import ParticipantTable from "@/features/participant-management/components/ParticipantTable";
import { api } from "@/trpc/react";
import {
  AlarmClock,
  AlertCircle,
  FileQuestion,
  Logs,
  Users,
} from "lucide-react";
import React, { use } from "react";

const ExamDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { data: exam, error } = api.examManagement.getById.useQuery({ id });

  return (
    <div>
      {!exam && error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {exam && (
        <div className="space-y-5">
          <Card>
            <CardHeader>
              {/* Header Section */}
              <section className="flex space-x-2">
                <h1 className="text-xl font-bold">{exam.title}</h1>{" "}
                <ToggleExamStatus currentActive={exam.isActive} id={id} />
              </section>
              <div className="flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-gray-500">
                <AlarmClock /> {exam.duration} minutes
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-[repeat(auto-fill,minmax(288px,1fr))] gap-3 py-2">
              <ExamStatCard
                className="bg-yellow-50 text-yellow-600"
                title="Total Participant"
                value={exam.Participant.length}
                icon={<Users />}
              />
              <ExamStatCard
                className="bg-purple-50 text-purple-600"
                title="Participant Submitted"
                value={
                  exam.Participant.filter((participant) => participant.lockedAt)
                    .length
                }
                icon={<Users />}
              />
              <ExamStatCard
                className="bg-blue-50 text-blue-600"
                title="Log Aktivitas"
                href="#"
                value={"1320"}
                icon={<Logs />}
              />
              <ExamStatCard
                className="bg-green-50 text-green-600"
                title="Total Question"
                href={`/dashboard/exam/${id}/question?exam_name=${exam.title}`}
                value={exam.sections.reduce(
                  (acc, section) => acc + section.questions.length,
                  0,
                )}
                icon={<FileQuestion />}
              />
            </CardContent>
          </Card>
          <ParticipantTable examId={id} />
        </div>
      )}
    </div>
  );
};

export default ExamDetailPage;

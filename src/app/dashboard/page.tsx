"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Activity, FormInput, MonitorPlay } from "lucide-react";
import React from "react";

const DashboardPage = () => {
  const {
    data: exams,
    error,
    isLoading,
  } = api.examManagement.getAll.useQuery();

  const now = new Date();
  const activeExams = exams?.filter((exam) => exam.isActive);
  const runningExams = exams?.filter(
    (exam) => new Date(exam.startTime) <= now && new Date(exam.endTime) >= now,
  );
  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row">
        <EventsStatCard
          title="Total Events"
          value={exams?.length ?? 0}
          icon={<FormInput />}
          className="bg-primary"
        />
        <EventsStatCard
          title="Active Events"
          value={activeExams?.length ?? 0}
          icon={<Activity />}
          className="bg-yellow-500"
        />
        <EventsStatCard
          title="Running Events"
          value={runningExams?.length ?? 0}
          icon={<MonitorPlay />}
          className="bg-green-500"
        />
      </div>
    </div>
  );
};

function EventsStatCard({
  title,
  value,
  className,
  icon,
}: {
  title: string;
  value: any;
  className?: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="min-h-40 flex-1">
      <CardContent className="my-auto flex items-start gap-4">
        <div
          className={cn(
            "bg-primary h-fit rounded-full p-4 text-white",
            className,
          )}
        >
          {icon}
        </div>
        <div className="space-y-2">
          <CardDescription>{title}</CardDescription>
          <span className="text-3xl font-bold">{value}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default DashboardPage;

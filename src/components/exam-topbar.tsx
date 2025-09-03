"use client";

import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { useExam } from "@/hooks/use-exam";
import ExamTimer from "@/features/exam/components/ExamTimer";
import FinishExamButton from "@/features/exam/components/FinishExamButton";

const ExamTopBar = () => {
  const { exam, expiredAt, currentTimestamp, lockAnswer, isFetching } =
    useExam();
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-slate-50 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="line-clamp-1 overflow-hidden font-semibold">
          {exam?.title}
        </h1>
      </div>
      <div className="flex gap-2">
        <ExamTimer
          currentTimestamp={currentTimestamp ?? new Date()}
          expiredAt={expiredAt ?? new Date()}
          loading={isFetching}
          callback={lockAnswer}
        />
        <FinishExamButton />
      </div>
    </header>
  );
};

export default ExamTopBar;

"use client";

import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";
import { AlarmClock, Flag } from "lucide-react";
import { useExam } from "@/hooks/use-exam";

const ExamTopBar = () => {
  const { exam } = useExam();
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-slate-50 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="line-clamp-1 overflow-hidden font-semibold">
          {exam?.title}
        </h1>
      </div>
      <div className="flex gap-2">
        <Button disabled className="bg-red-100 font-semibold text-red-600">
          <AlarmClock />
          01:50:29
        </Button>
        <Button className="bg-yellow-500 hover:bg-yellow-400">
          <Flag />
          Selesaikan Ujian
        </Button>
      </div>
    </header>
  );
};

export default ExamTopBar;

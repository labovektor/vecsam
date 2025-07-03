"use client";

import { Button } from "@/components/ui/button";
import { useExam } from "@/hooks/use-exam";
import { MoveLeft, MoveRight } from "lucide-react";
import React from "react";

const QuestionNavigator = () => {
  const { setFocusedBefore, setFocusedAfter } = useExam();
  return (
    <div className="flex w-full justify-center gap-2">
      <Button variant="outline" onClick={setFocusedBefore}>
        <MoveLeft /> Sebelumnya
      </Button>
      <Button variant="outline" onClick={setFocusedAfter}>
        Selanjutnya <MoveRight />
      </Button>
    </div>
  );
};

export default QuestionNavigator;

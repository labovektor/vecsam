"use client";

import { AlarmClock } from "lucide-react";
import React, { useState, useEffect } from "react";

const ExamTimer = ({ expiredAt }: { expiredAt: Date | null }) => {
  if (!expiredAt) {
    return null;
  }
  const [timeLeft, setTimeLeft] = useState(expiredAt.getTime() - Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(expiredAt.getTime() - Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expiredAt]);

  const hours = Math.floor(timeLeft / (60 * 60 * 1000));
  const minutes = Math.floor((timeLeft / (60 * 1000)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="flex h-9 items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-600">
      <AlarmClock />
      {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
};

export default ExamTimer;

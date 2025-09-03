"use client";

import { AlarmClock } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

/**
 * ExamTimer is a React component that displays a countdown timer
 * until a specified expiration date and time. It updates every second
 * to show the remaining hours, minutes, and seconds. The timer is rendered
 * as a styled div with a clock icon. If no expiration date is provided,
 * the component returns null.
 *
 * @param {Date | null} props.expiredAt - The expiration date and time for the countdown.
 *                                         If null, the timer does not render.
 */

const ExamTimer = ({
  expiredAt,
  currentTimestamp,
  callback,
  loading = false,
}: {
  currentTimestamp: Date;
  expiredAt: Date;
  loading: boolean;
  callback: VoidFunction;
}) => {
  const targetTime = expiredAt.getTime();
  const offsetTime = currentTimestamp.getTime() - Date.now();
  const [remaining, setRemaining] = React.useState(
    targetTime - (Date.now() + offsetTime),
  );
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    intervalRef.current = setInterval(() => {
      const timeLeft = targetTime - (Date.now() + offsetTime);
      if (timeLeft <= 0) {
        setRemaining(0);
        if (!loading) {
          clearInterval(intervalRef.current!);
          toast.error("Waktu pengerjaan telah habis");
          callback();
        }
      } else {
        setRemaining(timeLeft);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [targetTime]);

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return (
    <div className="flex h-9 items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-600">
      <AlarmClock />
      {`${hours} : ${minutes} : ${seconds}`}
    </div>
  );
};

export default ExamTimer;

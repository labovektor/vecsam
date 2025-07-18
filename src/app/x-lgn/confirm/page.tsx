"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginAction } from "@/features/participant-auth/actions";
import { beautifyDate } from "@/lib/utils";
import { api } from "@/trpc/react";
import { AlarmClock, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import React from "react";
import { toast } from "sonner";

const ExamLoginConfirmPage = () => {
  const [starting, setStarting] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("xt_id");

  const { data: exam, error } = api.participantAuth.getExam.useQuery({
    id: id ?? "",
  });

  const confirmStart = async () => {
    setStarting(true);
    const res = await loginAction({ participantId: id! });
    setStarting(false);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    router.replace("/exam");
  };

  return (
    <div className="flex h-svh w-full items-center justify-center p-3">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Image
            src="/vecsys.svg"
            alt="logo"
            width={160}
            height={100}
            className="mx-auto"
          />
        </CardHeader>
        <CardContent>
          {error && <p>{error.message}</p>}
          {exam && (
            <div className="flex flex-col items-center gap-5">
              <CardTitle className="text-primary text-center">
                {exam.title}
              </CardTitle>
              <CardDescription>
                {beautifyDate(exam.startTime, "FULL")} -{" "}
                {beautifyDate(exam.endTime, "FULL")}
              </CardDescription>

              <Badge className="bg-red-100 text-red-600">
                <AlarmClock />
                {exam.duration} Menit
              </Badge>

              <Alert>
                <AlertCircle />
                <AlertTitle>Catatan!</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap">
                  {exam.description}
                </AlertDescription>
              </Alert>

              <Button
                className="w-full"
                onClick={confirmStart}
                disabled={starting}
              >
                Mulai Ujian Sekarang
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamLoginConfirmPage;

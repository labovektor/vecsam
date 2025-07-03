"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { useExam } from "@/hooks/use-exam";
import { Flag } from "lucide-react";
import React from "react";

const FinishExamButton = () => {
  const { lockAnswer, isSaving } = useExam();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={isSaving}
          className="bg-yellow-500 hover:bg-yellow-400"
        >
          <Flag />
          Selesaikan Ujian
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Kamu Benar-Benar Yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Pastikan kamu telah cek ulang semua jawabanmu.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batalkan</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={lockAnswer}
          >
            Konfirmasi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FinishExamButton;

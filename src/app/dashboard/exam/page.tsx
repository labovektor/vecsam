"use client";

import { DataTable } from "@/components/table/data-table";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { examColumns } from "@/features/exam/components/columns";
import NewExamForm from "@/features/exam/forms/NewExamForm";
import { api } from "@/trpc/react";
import { Plus } from "lucide-react";
import React from "react";

const ListExamPage = () => {
  const { data: exams, error, isLoading } = api.exam.getAll.useQuery();

  return (
    <div>
      <DataTable
        columns={examColumns}
        data={exams ?? []}
        loading={isLoading}
        message={error?.message}
        actions={() => (
          <Dialog>
            <DialogTrigger className={buttonVariants({ variant: "default" })}>
              <Plus /> New Exam
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Exam</DialogTitle>
              </DialogHeader>
              <NewExamForm />
            </DialogContent>
          </Dialog>
        )}
      />
    </div>
  );
};

export default ListExamPage;

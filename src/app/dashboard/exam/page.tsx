"use client";

import { DataTable } from "@/components/table/data-table";
import { examColumns } from "@/features/exam-management/components/columns";
import NewExamForm from "@/features/exam-management/forms/NewExamForm";
import { api } from "@/trpc/react";
import React from "react";

const ListExamPage = () => {
  const {
    data: exams,
    error,
    isLoading,
  } = api.examManagement.getAll.useQuery();

  return (
    <div>
      <DataTable
        columns={examColumns}
        data={exams ?? []}
        loading={isLoading}
        message={error?.message}
        actions={() => <NewExamForm />}
      />
    </div>
  );
};

export default ListExamPage;

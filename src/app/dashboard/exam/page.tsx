"use client"

import { DataTable } from "@/components/table/data-table"
import { examColumns } from "@/features/exam-management/components/columns"
import NewExamForm from "@/features/exam-management/forms/NewExamForm"
import { useTRPC } from "@/trpc/react"
import { useQuery } from "@tanstack/react-query"
import React from "react"

const ListExamPage = () => {
  const trpc = useTRPC()
  const {
    data: exams,
    error,
    isLoading,
  } = useQuery(trpc.examManagement.getAll.queryOptions(undefined))

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
  )
}

export default ListExamPage

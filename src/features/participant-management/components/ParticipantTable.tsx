"use client";

import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Upload } from "lucide-react";
import React from "react";
import AddParticipantForm from "../forms/AddParticipantForm";
import {
  excelParticipantColumn,
  participantColumnns,
} from "./participantColumn";
import { exportAsExcelFile } from "@/lib/xlsx";
import { BulkAddParticipantsForm } from "../forms/BulkAddParticipantForm";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const ParticipantTable = ({ examId }: { examId: string }) => {
  const { data: participants, isLoading } =
    api.participantManagement.getAllByExamId.useQuery({ id: examId });
  return (
    <DataTable
      columns={participantColumnns}
      data={participants ?? []}
      loading={isLoading}
      actions={(data, table) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              onCheckedChange={(val) => {
                table.getColumn("startedAt")?.setFilterValue(val);
              }}
              id="filter-take-session"
            />
            <label htmlFor="filter-take-session">
              Sembunyikan Tidak Ambil Sesi
            </label>
          </div>
          <Separator orientation="vertical" />
          <AddParticipantForm examId={examId} />
          <BulkAddParticipantsForm examId={examId} />
          <Button
            variant="secondary"
            onClick={() =>
              exportAsExcelFile(data, excelParticipantColumn, "Participants")
            }
          >
            Export Excel <Upload />
          </Button>
        </div>
      )}
    />
  );
};

export default ParticipantTable;

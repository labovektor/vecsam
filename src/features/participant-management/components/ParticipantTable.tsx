"use client";

import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Download, Upload } from "lucide-react";
import React from "react";
import AddParticipantForm from "../forms/AddParticipantForm";
import {
  excelParticipantColumn,
  participantColumnns,
} from "./participantColumn";
import { exportAsExcelFile } from "@/lib/xlsx";

const ParticipantTable = ({ examId }: { examId: string }) => {
  const { data: participants } =
    api.participantManagement.getAllByExamId.useQuery({ id: examId });
  return (
    <DataTable
      columns={participantColumnns}
      data={participants ?? []}
      actions={(data) => (
        <>
          <AddParticipantForm examId={examId} />
          <Button>
            Import Dari CSV <Download />
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              exportAsExcelFile(data, excelParticipantColumn, "Participants")
            }
          >
            Export Excel <Upload />
          </Button>
        </>
      )}
    />
  );
};

export default ParticipantTable;

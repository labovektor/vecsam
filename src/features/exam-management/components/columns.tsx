"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ExamRes, ExamSchemaType } from "../schema";
import { beautifyDate } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { api } from "@/trpc/react";

export const examColumns: ColumnDef<ExamRes>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "title", header: "Title" },
  {
    accessorKey: "startTime",
    header: "Start Time",
    enableGlobalFilter: false,
    cell: ({ row }) => beautifyDate(row.getValue("startTime"), "FULL"),
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    enableGlobalFilter: false,
    cell: ({ row }) => beautifyDate(row.getValue("endTime"), "FULL"),
  },
  {
    accessorKey: "duration",
    header: "Duration",
    enableGlobalFilter: false,
    cell: ({ row }) => `${row.getValue("duration")} minutes`,
  },
  {
    accessorKey: "isActive",
    header: "Active",
    enableGlobalFilter: false,
    cell: ({ row }) =>
      row.getValue("isActive") ? (
        <span className="text-green-700">Yes</span>
      ) : (
        <span className="text-destructive">No</span>
      ),
  },
  {
    id: "action",
    enableGlobalFilter: false,
    cell: ({ row }) => <EventActionColumn exam={row.original} />,
    header: "Action",
  },
];

export function EventActionColumn({ exam }: { exam: ExamRes }) {
  const deleteExam = api.examManagement.delete.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Exam Deleted");
    },
  });
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>
            <Link
              href={`/dashboard/exam/${exam.id}`}
              className={buttonVariants({
                variant: "ghost",
                size: "simple",
              })}
            >
              <Eye />
              View Exam details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(exam.id)}
          >
            Copy Exam ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(exam.passcode)}
          >
            Copy Exam Passcode
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="text-destructive" /> Delete Exam
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Kamu Benar-Benar Yakin?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batalkan</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={() => deleteExam.mutate({ id: exam.id })}
          >
            Konfirmasi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

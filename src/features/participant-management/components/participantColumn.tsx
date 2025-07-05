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
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { beautifyDate } from "@/lib/utils";
import { api } from "@/trpc/react";
import type { Participant, ParticipantSession } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { getQueryKey } from "@trpc/react-query";
import type { IColumn } from "json-as-xlsx";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export const excelParticipantColumn: IColumn[] = [
  {
    label: "ID",
    value: "id",
  },
  {
    label: "Name",
    value: "name",
  },
  {
    label: "Passcode",
    value: "passcode",
  },
  {
    label: "Skor",
    value: "score",
  },
  {
    label: "Memulai Sesi Pada",
    value: (row) => beautifyDate(row.createdAt as string, "FULL"),
  },
  {
    label: "Dikunci Pada",
    value: (row) =>
      row.lockedAt ? beautifyDate(row.lockedAt as Date, "FULL") : "-",
  },
];

export const participantColumnns: ColumnDef<
  Participant & { participantSession: ParticipantSession | null }
>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "passcode",
    header: "Passcode",
    enableGlobalFilter: false,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "startedAt",
    header: "Memulai Sesi Pada",
    enableGlobalFilter: false,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const startedAt = row.original.participantSession?.createdAt;
      return startedAt ? beautifyDate(startedAt, "FULL") : "-";
    },
    filterFn: (row, id, value) => {
      if (value === true) return row.original.participantSession !== null;
      return true;
    },
  },
  {
    accessorKey: "lockedAt",
    header: "Dikunci Pada",
    enableGlobalFilter: false,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const lockedAt = row.original.lockedAt;
      return lockedAt ? beautifyDate(lockedAt, "FULL") : "-";
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Skor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableGlobalFilter: false,
    enableHiding: false,
  },
  {
    id: "actions",
    header: "Actions",
    enableGlobalFilter: false,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => <ParticipantActionColumn participant={row.original} />,
  },
];

export function ParticipantActionColumn({
  participant,
}: {
  participant: Participant;
}) {
  const queryClient = useQueryClient();
  const remove = api.participantManagement.remove.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Participant Removed");
      queryClient.refetchQueries({
        queryKey: getQueryKey(api.participantManagement.getAllByExamId),
      });
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
              href={`/dashboard/exam/${participant.examId}/participant/${participant.id}?name=${participant.name}`}
              className={buttonVariants({
                variant: "ghost",
                size: "simple",
              })}
            >
              <Pencil />
              Beri Penilaian
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(participant.passcode)}
          >
            Copy Participant Passcode
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="text-destructive" /> Remove Participant
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
            onClick={() => remove.mutate({ id: participant.id })}
          >
            Konfirmasi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

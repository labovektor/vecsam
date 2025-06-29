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
import type { Participant } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { getQueryKey } from "@trpc/react-query";
import type { IColumn } from "json-as-xlsx";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
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
    label: "Didaftarkan Pada",
    value: (row) => beautifyDate(row.createdAt as string, "FULL"),
  },
];

export const participantColumnns: ColumnDef<Participant>[] = [
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
              href={`/dashboard/participant/${participant.id}`}
              className={buttonVariants({
                variant: "ghost",
                size: "simple",
              })}
            >
              <Eye />
              View Participant details
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

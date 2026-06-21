"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useTRPC } from "@/trpc/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { csvToText } from "@/lib/form-utils"
import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"

export const BulkAddParticipantsForm = ({ examId }: { examId: string }) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = React.useState(false)

  const form = useForm()
  const [csvError, setCsvError] = useState<string | null>(null)
  const [csvPreview, setCsvPreview] = useState<string | null>(null)

  const trpc = useTRPC()
  const bulkAdd = useMutation(
    trpc.participantManagement.bulkAddFromCsv.mutationOptions({
      onSuccess(data) {
        toast.success(`Berhasil tambah ${data.count} peserta.`)
        setOpen(false)
        setCsvError(null)
        setCsvPreview(null)
        queryClient.refetchQueries({
          queryKey: trpc.participantManagement.getAllByExamId.queryKey(),
        })
      },
      onError(error) {
        toast.error(error.message)
      },
    }),
  )

  const onSubmit = async () => {
    const csv = await fileTextPromise
    if (!csv) return

    bulkAdd.mutate({ csv, examId })
  }

  const [fileTextPromise, setFileTextPromise] =
    useState<Promise<string> | null>(null)

  const handleCsvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const textPromise = csvToText(file)
      const text = await textPromise
      if (
        !text.includes("team_id") ||
        !text.includes("name") ||
        !text.includes("email")
      ) {
        setCsvError("CSV harus mengandung kolom team_id, name, email")
        setCsvPreview(null)
        return
      }

      setCsvError(null)
      setCsvPreview(text.slice(0, 300) + (text.length > 300 ? "..." : ""))
      setFileTextPromise(textPromise)
    } catch (e) {
      setCsvError("Gagal membaca file CSV")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        setCsvError(null)
        setCsvPreview(null)
        form.reset()
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          Import dari CSV <Download />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-3xl">
        <DialogHeader>
          <DialogTitle>Tambahkan Peserta</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-md space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={() => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvChange}
                    />
                  </FormControl>
                  {csvError && (
                    <p className="text-sm text-red-600">{csvError}</p>
                  )}
                  {csvPreview && (
                    <pre className="bg-muted max-h-32 overflow-x-auto rounded p-2 text-xs">
                      {csvPreview}
                    </pre>
                  )}
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={!fileTextPromise || bulkAdd.isPending}
              className="w-full"
            >
              {bulkAdd.isPending ? "Mengunggah..." : "Tambah Peserta"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

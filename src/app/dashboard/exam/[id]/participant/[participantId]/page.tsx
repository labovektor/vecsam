"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { renderKatexFromHtml } from "@/lib/katex-utils"
import { cn } from "@/lib/utils"
import { useTRPC } from "@/trpc/react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { ArrowRight, Check, Undo, X } from "lucide-react"
import { useSearchParams } from "next/navigation"
import React, { use, useMemo } from "react"
import { toast } from "sonner"

type CorrectionType = Record<
  string,
  { correct: Set<string>; wrong: Set<string>; pass: Set<string> }
>

const ParticipantDetailPage = ({
  params,
}: {
  params: Promise<{ id: string; participantId: string }>
}) => {
  const { id, participantId } = use(params)
  const searchParams = useSearchParams()
  const name = searchParams.get("name")

  const [score, setScore] = React.useState("0")
  const [userCorrection, setUserCorrection] = React.useState<CorrectionType>({})

  const trpc = useTRPC()

  const { data: sections } = useQuery(
    trpc.section.getSections.queryOptions({ examId: id }),
  )
  const { data: participantAnswers } = useQuery(
    trpc.participantManagement.getAnswers.queryOptions({
      id: participantId,
    }),
  )

  // Default correction derived from data (questions without answers → pass)
  const defaultCorrection = useMemo(() => {
    if (!sections || !participantAnswers) return {}
    const initial: CorrectionType = {}
    sections.forEach((section) => {
      const passed = new Set<string>()
      section.questions.forEach((q) => {
        if (!participantAnswers[q.id]) passed.add(q.id)
      })
      initial[section.id] = {
        correct: new Set(),
        wrong: new Set(),
        pass: passed,
      }
    })
    return initial
  }, [sections, participantAnswers])

  // Merge defaults with user overrides from button clicks
  const correction = useMemo(() => {
    const merged: CorrectionType = {}
    for (const [sectionId, def] of Object.entries(defaultCorrection)) {
      const userSec = userCorrection[sectionId]
      merged[sectionId] = {
        correct: new Set(userSec?.correct ?? def!.correct),
        wrong: new Set(userSec?.wrong ?? def!.wrong),
        pass: new Set(userSec?.pass ?? def!.pass),
      }
    }
    return merged
  }, [defaultCorrection, userCorrection])

  const countScore = () => {
    let totalScore = 0
    sections?.forEach((section) => {
      if (correction[section.id]) {
        totalScore +=
          (correction[section.id]?.correct.size ?? 0) * section.correctPoint
        totalScore +=
          (correction[section.id]?.wrong.size ?? 0) * section.wrongPoint
        totalScore +=
          (correction[section.id]?.pass.size ?? 0) * section.passPoint
      }
    })
    setScore(totalScore.toString())
  }

  const saveScore = useMutation(
    trpc.participantManagement.setScore.mutationOptions({
      onError: (error) => {
        toast.error(error.message)
      },
      onSuccess: () => {
        toast.success("Nilai berhasil disimpan")
      },
    }),
  )

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">Detail Peserta: {name}</h1>
      {sections &&
        participantAnswers &&
        sections.map((section) => (
          <Card key={section.id}>
            <CardHeader className="flex items-center">
              <CardTitle>{section.title}</CardTitle>
              <Badge className="bg-green-500">
                Benar: {correction[section.id]?.correct.size} *{" "}
                {section.correctPoint}
              </Badge>
              <Badge className="bg-red-500">
                Salah: {correction[section.id]?.wrong.size} *{" "}
                {section.wrongPoint}
              </Badge>
              <Badge className="bg-yellow-500">
                Tidak Dikerjakan: {correction[section.id]?.pass.size} *{" "}
                {section.passPoint}
              </Badge>
              <Badge className="bg-gray-500">
                Belum Dinilai:{" "}
                {section.questions.length -
                  ((correction[section.id]?.correct.size ?? 0) +
                    (correction[section.id]?.wrong.size ?? 0) +
                    (correction[section.id]?.pass.size ?? 0))}
              </Badge>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Soal</TableHead>
                    <TableHead>jawaban Peserta</TableHead>
                    <TableHead className="text-right">Pilih Koreksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell>
                        <span
                          className={cn(
                            "flex aspect-square w-7 items-center justify-center rounded-full border-2",
                            correction[section.id]?.pass.has(question.id)
                              ? "border-gray-400 text-gray-400"
                              : "",
                            correction[section.id]?.correct.has(question.id)
                              ? "border-green-500 text-green-500"
                              : "",
                            correction[section.id]?.wrong.has(question.id)
                              ? "border-red-500 text-red-500"
                              : "",
                          )}
                        >
                          {question.number}
                        </span>
                      </TableCell>
                      <TableCell
                        dangerouslySetInnerHTML={{
                          __html: renderKatexFromHtml(question.text),
                        }}
                        className="max-w-lg overflow-auto"
                      ></TableCell>
                      {section.type === "MULTIPLE_CHOICE" && (
                        <TableCell className="max-w-lg overflow-auto">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: renderKatexFromHtml(
                                question.MultipleChoiceOption.find(
                                  (option) =>
                                    option.id ===
                                    participantAnswers[question.id]?.optionId,
                                )?.text ?? "-",
                              ),
                            }}
                          ></span>
                          <img
                            src={
                              question.MultipleChoiceOption.find(
                                (option) =>
                                  option.id ===
                                  participantAnswers[question.id]?.optionId,
                              )?.image ?? undefined
                            }
                            alt=""
                          />
                        </TableCell>
                      )}
                      {section.type === "SHORT_ANSWER" && (
                        <TableCell>
                          {participantAnswers[question.id]
                            ? participantAnswers[question.id]?.answerText
                            : "-"}
                        </TableCell>
                      )}
                      {section.type === "FILE_ANSWER" && (
                        <TableCell>
                          {participantAnswers[question.id] ? (
                            <a
                              className="underline"
                              href={participantAnswers[question.id]?.answerFile}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              Lihat Jawaban
                            </a>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      )}
                      <TableCell className="space-x-2 text-right">
                        {participantAnswers[question.id] && (
                          <>
                            <Button
                              size="icon"
                              className="bg-green-500 hover:bg-green-400"
                              onClick={() =>
                                setUserCorrection((prev) => {
                                  const prevSection = prev[section.id] ?? {
                                    correct: new Set<string>(),
                                    wrong: new Set<string>(),
                                    pass: new Set<string>(),
                                  }

                                  prevSection.wrong.delete(question.id)
                                  prevSection.correct.add(question.id)

                                  return {
                                    ...prev,
                                    [section.id]: prevSection,
                                  }
                                })
                              }
                            >
                              <Check />
                            </Button>
                            {/* Button to mark as wrong */}
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => {
                                setUserCorrection((prev) => {
                                  const prevSection = prev[section.id] ?? {
                                    correct: new Set<string>(),
                                    wrong: new Set<string>(),
                                    pass: new Set<string>(),
                                  }

                                  prevSection.correct.delete(question.id)
                                  prevSection.wrong.add(question.id)

                                  return {
                                    ...prev,
                                    [section.id]: prevSection,
                                  }
                                })
                              }}
                            >
                              <X />
                            </Button>
                            {/* Button to unmark */}
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={() => {
                                setUserCorrection((prev) => {
                                  const prevSection = prev[section.id] ?? {
                                    correct: new Set<string>(),
                                    wrong: new Set<string>(),
                                    pass: new Set<string>(),
                                  }

                                  prevSection.correct.delete(question.id)
                                  prevSection.wrong.delete(question.id)

                                  return {
                                    ...prev,
                                    [section.id]: prevSection,
                                  }
                                })
                              }}
                            >
                              <Undo />
                            </Button>
                          </>
                        )}
                        {/* Button to mark as correct */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={countScore}>
          Hitung Kemungkinan Nilai
        </Button>
        <ArrowRight />
        <Input
          type="number"
          value={score}
          disabled={saveScore.isPending}
          onChange={(e) => setScore(e.target.value)}
        />
        <Button
          disabled={saveScore.isPending}
          onClick={() =>
            saveScore.mutate({ id: participantId, score: Number(score) })
          }
        >
          Simpan Nilai <Check />
        </Button>
      </div>
    </div>
  )
}

export default ParticipantDetailPage

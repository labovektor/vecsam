"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { renderKatexFromHtml } from "@/lib/katex-utils";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ArrowRight, Check, Undo, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { use, useEffect } from "react";
import { toast } from "sonner";

type CorrectionType = Record<
  string,
  { correct: Set<string>; wrong: Set<string>; pass: Set<string> }
>;

const ParticipantDetailPage = ({
  params,
}: {
  params: Promise<{ id: string; participantId: string }>;
}) => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const { id, participantId } = use(params);
  const [score, setScore] = React.useState("0");
  const [correction, setCorrection] = React.useState<CorrectionType>({});

  const { data: sections, isSuccess: getSectionsSuccess } =
    api.section.getSections.useQuery({ examId: id });
  const { data: participantAnswers, isSuccess: getParticipantAnswersSuccess } =
    api.participantManagement.getAnswers.useQuery({ id: participantId });

  useEffect(() => {
    if (getSectionsSuccess && getParticipantAnswersSuccess) {
      const initialCorrection: CorrectionType = {};
      sections?.forEach((section) => {
        const passedQuestions: Set<string> = new Set();
        section.questions.forEach((question) => {
          if (!participantAnswers[question.id]) {
            passedQuestions.add(question.id);
          }
        });
        initialCorrection[section.id] = {
          correct: new Set(),
          wrong: new Set(),
          pass: passedQuestions,
        };
      });
      setCorrection(initialCorrection);
    }
  }, [getSectionsSuccess, getParticipantAnswersSuccess]);

  const countScore = () => {
    let totalScore = 0;
    sections?.forEach((section) => {
      if (correction[section.id]) {
        totalScore +=
          (correction[section.id]?.correct.size ?? 0) * section.correctPoint;
        totalScore +=
          (correction[section.id]?.wrong.size ?? 0) * section.wrongPoint;
        totalScore +=
          (correction[section.id]?.pass.size ?? 0) * section.passPoint;
      }
    });
    setScore(totalScore.toString());
  };

  const saveScore = api.participantManagement.setScore.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Nilai berhasil disimpan");
    },
  });

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
                                setCorrection((prev) => {
                                  if (!prev[section.id]) {
                                    return prev;
                                  }

                                  const prevCorrect = prev[section.id]!.correct;
                                  const prevWrong = prev[section.id]!.wrong;

                                  // Make sure there is no question.id in prevWrong
                                  prevWrong.delete(question.id);
                                  prevCorrect.add(question.id);

                                  return {
                                    ...prev,
                                    [section.id]: {
                                      ...prev[section.id]!,
                                      correct: prevCorrect,
                                      wrong: prevWrong,
                                    },
                                  };
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
                                setCorrection((prev) => {
                                  if (!prev[section.id]) {
                                    return prev;
                                  }
                                  const prevCorrect = prev[section.id]!.correct;
                                  const prevWrong = prev[section.id]!.wrong;

                                  // Make sure there is no question.id in prevCorrect
                                  prevCorrect.delete(question.id);
                                  prevWrong.add(question.id);
                                  return {
                                    ...prev,
                                    [section.id]: {
                                      ...prev[section.id]!,
                                      correct: prevCorrect,
                                      wrong: prevWrong,
                                    },
                                  };
                                });
                              }}
                            >
                              <X />
                            </Button>
                            {/* Button to unmark */}
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={() => {
                                setCorrection((prev) => {
                                  if (!prev[section.id]) {
                                    return prev;
                                  }
                                  let prevCorrect = prev[section.id]!.correct;
                                  let prevWrong = prev[section.id]!.wrong;

                                  // Make sure there is no question.id in both prevCorrect and prevWrong
                                  prevCorrect.delete(question.id);
                                  prevWrong.delete(question.id);
                                  return {
                                    ...prev,
                                    [section.id]: {
                                      ...prev[section.id]!,
                                      correct: prevCorrect,
                                      wrong: prevWrong,
                                    },
                                  };
                                });
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
  );
};

export default ParticipantDetailPage;

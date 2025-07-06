import type {
  MultipleChoiceOption,
  Question,
  QuestionAttr,
  SectionType,
} from "@prisma/client";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { renderKatexFromHtml } from "@/lib/katex-utils";
import { CircleDotDashed, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import EditQuestionForm from "../form/EditQuestionForm";
import AddMutipleChoiceOptionForm from "../form/AddMultipleChoiceOptionForm";
import EditMutipleChoiceOptionForm from "../form/EditMultipleChoiceOptionForm";
import EditQuestionAttrForm from "../form/EditQuestionAttrForm";

const QuestionCard = ({
  sectionType,
  question,
}: {
  sectionType: SectionType;
  question: Question & {
    MultipleChoiceOption: MultipleChoiceOption[];
    QuestionAttr: QuestionAttr | null;
  };
}) => {
  const queryClient = useQueryClient();
  const deleteQuestion = api.question.deleteQuestion.useMutation({
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: getQueryKey(api.question.getQuestions),
      });
      toast.success("Pertanyaan berhasil dihapus");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const deleteMultipleChoiceOption =
    api.question.deleteMultipleChoiceOption.useMutation({
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: getQueryKey(api.question.getQuestions),
        });
        toast.success("Opsi jawaban berhasil dihapus");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  return (
    <Card>
      <CardHeader className="flex gap-2">
        <span>{question.number}. </span>
        <div>
          <span
            dangerouslySetInnerHTML={{
              __html: renderKatexFromHtml(question.text),
            }}
          />
          {question.image && (
            <img
              src={question.image}
              alt="question image"
              className="max-h-36"
            />
          )}
        </div>
        <div className="flex-1" />

        {sectionType === "MULTIPLE_CHOICE" && (
          <>
            <AddMutipleChoiceOptionForm questionId={question.id} />
            <div className="border-muted h-9 border"></div>
          </>
        )}
        <EditQuestionForm question={question} />
        <Button
          size="icon"
          variant="destructive"
          onClick={() => deleteQuestion.mutate({ id: question.id })}
        >
          <Trash />
        </Button>
      </CardHeader>
      <CardContent>
        {sectionType === "MULTIPLE_CHOICE" &&
          question.MultipleChoiceOption.map((option) => (
            <div
              key={option.id}
              className="group my-1 flex min-h-7 items-start gap-2"
            >
              <CircleDotDashed className="text-muted-foreground" />
              <div>
                <span
                  dangerouslySetInnerHTML={{
                    __html: renderKatexFromHtml(option.text),
                  }}
                />
                {option.image && (
                  <img
                    src={option.image}
                    alt="option image"
                    className="max-h-36"
                  />
                )}
              </div>
              <div className="hidden gap-2 group-hover:flex">
                <EditMutipleChoiceOptionForm multipleChoiceOption={option} />
                <Button
                  size="icon"
                  variant="destructive"
                  className="size-7"
                  onClick={() =>
                    deleteMultipleChoiceOption.mutate({ id: option.id })
                  }
                >
                  <Trash />
                </Button>
              </div>
            </div>
          ))}

        {sectionType === "FILE_ANSWER" && question && (
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h3>File pertanyaan:</h3>
                <Button size="icon">
                  <Edit />
                </Button>
              </div>
              {question.QuestionAttr && question.QuestionAttr.file && (
                <a
                  href={question.QuestionAttr.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Download
                </a>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3>File template jawaban:</h3>
                <EditQuestionAttrForm
                  type="templateFile"
                  questionId={question.id}
                />
              </div>
              {question.QuestionAttr && question.QuestionAttr.templateFile && (
                <a
                  href={question.QuestionAttr.templateFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Download
                </a>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;

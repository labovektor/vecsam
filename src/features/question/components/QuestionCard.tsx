import type {
  MultipleChoiceOption,
  Question,
  QuestionAttr,
  SectionType,
} from "@prisma/client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { renderKatexFromHtml } from "@/lib/katex-utils";
import {
  CircleDot,
  CircleDotDashed,
  Download,
  Edit,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <Button size="icon">
          <Edit />
        </Button>
        {sectionType === "MULTIPLE_CHOICE" && (
          <Button size="icon" variant="secondary">
            <Plus />
          </Button>
        )}
        <Button size="icon" variant="destructive">
          <Trash />
        </Button>
      </CardHeader>
      <CardContent>
        {sectionType === "MULTIPLE_CHOICE" &&
          question.MultipleChoiceOption.map((option) => (
            <div key={option.id} className="my-2 flex items-start gap-2">
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
                <Button size="icon">
                  <Edit />
                </Button>
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

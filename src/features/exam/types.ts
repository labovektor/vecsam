import type {
  Exam,
  MultipleChoiceOption,
  Question,
  QuestionAttr,
  Section,
} from "@prisma/client";

export type QuestionWithAttr = Question & {
  QuestionAttr: QuestionAttr | null;
  MultipleChoiceOption: MultipleChoiceOption[];
};

export type SectionWithQuestionAttr = Section & {
  questions: QuestionWithAttr[];
};

export type ExamWithSectionQuestionAttr = Exam & {
  sections: SectionWithQuestionAttr[];
};

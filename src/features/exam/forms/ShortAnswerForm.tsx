"use client"

import { Input } from "@/components/ui/input"
import { useExam } from "@/hooks/use-exam"
import debounce from "lodash.debounce"
import React from "react"

const ShortAnswerForm = () => {
  const { focusedQuestion, saveAnswer, answers } = useExam()
  const cAnswer = focusedQuestion
    ? (answers[focusedQuestion?.id]?.answerText ?? "")
    : ""
  const [value, setValue] = React.useState(cAnswer)

  const [prevCAnswer, setPrevCAnswer] = React.useState(cAnswer)

  if (cAnswer !== prevCAnswer) {
    setValue(cAnswer)
    setPrevCAnswer(cAnswer)
  }

  const debouncedSaveRef = React.useRef<ReturnType<
    typeof debounce<(questionId: string, answerText: string) => void>
  > | null>(null)
  if (debouncedSaveRef.current === null) {
    debouncedSaveRef.current = debounce(
      (questionId: string, answerText: string) => {
        saveAnswer(questionId, { answerText })
      },
      800,
    )
  }

  React.useEffect(() => {
    const debouncedSave = debouncedSaveRef.current
    return () => {
      debouncedSave?.flush()
    }
  }, [])

  React.useEffect(() => {
    debouncedSaveRef.current?.flush()
  }, [focusedQuestion?.id])

  return (
    <Input
      value={value}
      onChange={(e) => {
        const newValue = e.target.value
        setValue(newValue)
        if (focusedQuestion) {
          debouncedSaveRef.current?.(focusedQuestion.id, newValue)
        }
      }}
      className="max-w-md"
    />
  )
}

export default ShortAnswerForm

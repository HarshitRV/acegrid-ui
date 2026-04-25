import { useState } from 'react'
import type { Question } from '#/types/question'
import { QuestionViewMode } from './question-view-mode'
import { QuestionEditMode } from './question-edit-mode'

/** The subset of Question data the edit form manages. */
export type QuestionFormValues = {
  text: string
  options: [string, string, string, string]
  correctIndex: string // stored as string for SelectField compatibility
  isFree: boolean
  tags: string[] | undefined
}

export type QuestionItemProps = {
  question: Question
  onDelete: (id: string) => void
  onUpdate: (id: string, data: QuestionFormValues) => void
}

export const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

export function QuestionItem({
  question,
  onDelete,
  onUpdate,
}: QuestionItemProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <QuestionEditMode
        question={question}
        onCancel={() => setIsEditing(false)}
        onSave={(data) => {
          onUpdate(question._id, data)
          setIsEditing(false)
        }}
      />
    )
  }

  return (
    <QuestionViewMode
      question={question}
      onEdit={() => setIsEditing(true)}
      onDelete={() => onDelete(question._id)}
    />
  )
}

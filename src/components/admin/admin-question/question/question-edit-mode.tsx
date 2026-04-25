import { useAppForm } from '#/components/ui/app-form'
import { Button } from '#/components/ui/button'
import type { Question } from '#/types/question'
import { Check, X } from 'lucide-react'
import type { QuestionFormValues } from './question-item'
import { OPTION_LABELS } from './question-item'
import { Item } from '#/components/ui/item'

export function QuestionEditMode({
  question,
  onCancel,
  onSave,
}: {
  question: Question
  onCancel: () => void
  onSave: (data: QuestionFormValues) => void
}) {
  const form = useAppForm({
    defaultValues: {
      text: question.text,
      options: [
        question.options[0].text,
        question.options[1].text,
        question.options[2].text,
        question.options[3].text,
      ] as [string, string, string, string],
      correctIndex: String(question.correctIndex ?? '0'),
      isFree: question.isFree,
      tags: question.tags.length > 0 ? question.tags : undefined,
    } satisfies QuestionFormValues,
    onSubmit: async ({ value }) => {
      onSave(value)
    },
  })

  return (
    <Item variant="outline" className="flex-col items-start gap-4 p-4">
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        {/* Question text */}
        <form.AppField
          name="text"
          children={(field) => (
            <field.TextField label="Question Text" required />
          )}
        />

        {/* Options */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {([0, 1, 2, 3] as const).map((i) => (
            <form.AppField
              key={i}
              name={`options[${i}]`}
              children={(field) => (
                <field.TextField
                  label={`Option ${OPTION_LABELS[i]}`}
                  required
                />
              )}
            />
          ))}
        </div>

        <form.AppField
          name="correctIndex"
          children={(field) => (
            <field.SelectField
              label="Correct Answer"
              required
              options={OPTION_LABELS.map((label, i) => ({
                label: `Option ${label}`,
                value: String(i),
              }))}
            />
          )}
        />

        <form.AppField
          name="isFree"
          children={(field) => (
            <field.SwitchField
              label="Free Question"
              description="Allow unenrolled users to attempt this question"
            />
          )}
        />

        {/* Tags */}
        <form.AppField
          name="tags"
          children={(field) => (
            <field.TagField
              label="Tags"
              placeholder="grammar, noun, abstract (comma-separated)"
            />
          )}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <Button type="button" size="sm" variant="outline" onClick={onCancel}>
            <X className="mr-1 size-3.5" />
            Cancel
          </Button>
          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button type="submit" size="sm" disabled={isSubmitting}>
                <Check className="mr-1 size-3.5" />
                Save
              </Button>
            )}
          />
        </div>
      </form>
    </Item>
  )
}

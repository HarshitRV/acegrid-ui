import { Label } from '#/components/ui/label'
import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group'
import type { Question } from '#/types/question'
import { Check } from 'lucide-react'
import { OPTION_LABELS } from './question-item'

export function QuestionOptionsView({
  options,
  correctIndex,
}: {
  options: Question['options']
  correctIndex: Question['correctIndex']
}) {
  return (
    <RadioGroup value={String(correctIndex ?? '')} className="w-fit" disabled>
      {options.map((opt) => {
        const isCorrect = opt.index === correctIndex
        return (
          <div key={opt.index} className="flex items-center gap-3">
            <RadioGroupItem
              value={String(opt.index)}
              id={`opt-view-${opt.index}`}
            />
            <Label
              htmlFor={`opt-view-${opt.index}`}
              className={
                isCorrect
                  ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                  : ''
              }
            >
              {OPTION_LABELS[opt.index]}. {opt.text}
              {isCorrect && (
                <Check className="ml-1 inline-block size-3.5 text-emerald-600 dark:text-emerald-400" />
              )}
            </Label>
          </div>
        )
      })}
    </RadioGroup>
  )
}

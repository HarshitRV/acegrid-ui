import type { Question } from '#/types/question'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Trash2, Pencil } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '#/components/ui/item'
import { QuestionOptionsView } from './question-option-view'

export function QuestionViewMode({
  question,
  onEdit,
  onDelete,
}: {
  question: Question
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Item variant="outline" className="flex-col items-start gap-4 p-4">
      {/* Header: question text + actions */}
      <ItemHeader>
        <ItemTitle className="line-clamp-none text-sm">
          {question.text}
        </ItemTitle>
        <ItemActions>
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-primary"
            onClick={onEdit}
          >
            <Pencil className="size-4" />
          </Button>
        </ItemActions>
      </ItemHeader>

      {/* Options */}
      <ItemContent>
        <QuestionOptionsView
          options={question.options}
          correctIndex={question.correctIndex}
        />
      </ItemContent>

      {/* Footer: badges */}
      <ItemFooter>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={question.isFree ? 'default' : 'secondary'}>
            {question.isFree ? 'Free' : 'Premium'}
          </Badge>
          {question.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </ItemFooter>
    </Item>
  )
}

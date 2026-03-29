import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
}

export function EmptyState({
  icon = <SearchX className="text-muted-foreground size-10" />,
  title = 'Nothing found',
  description = 'Try adjusting your filters or check back later.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      {icon}
      <div className="space-y-1">
        <p className="text-muted-foreground font-medium">{title}</p>
        <p className="text-muted-foreground/70 text-sm">{description}</p>
      </div>
    </div>
  )
}

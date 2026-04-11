import type { TitleDescriptionProps } from '#/components/reusable/common-props'

type PageHeaderProps = TitleDescriptionProps

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="mb-1 text-3xl font-bold">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  )
}

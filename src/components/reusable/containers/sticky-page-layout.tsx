import React from 'react'

export interface StickyPageLayoutProps {
  header?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}

export function StickyPageLayout({
  header,
  children,
  footer,
}: StickyPageLayoutProps) {
  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto] overflow-hidden">
      {header && <div className="mb-4">{header}</div>}

      <div className="overflow-y-auto px-1 pb-4">{children}</div>

      {footer && <div className="mt-4">{footer}</div>}
    </div>
  )
}

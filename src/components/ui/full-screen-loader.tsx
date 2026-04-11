import { Loader2 } from 'lucide-react'

export function FullScreenLoader() {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  )
}

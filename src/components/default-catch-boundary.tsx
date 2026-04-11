import { Link, rootRouteId, useMatch, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { AlertCircle, ArrowLeft, Home, RotateCcw } from 'lucide-react'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error(`
    #############DefaultCatchBoundary#############
    ${error}
    ##############################################
  `)

  return (
    <main className="flex min-w-0 flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <div className="bg-destructive/10 mb-6 flex h-16 w-16 items-center justify-center rounded-full">
        <AlertCircle className="text-destructive h-8 w-8" />
      </div>

      <p className="text-destructive text-5xl font-extrabold tracking-tight sm:text-7xl">
        Oops!
      </p>
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm sm:text-base">
        An unexpected error occurred. You can try again or head back to safety.
      </p>

      <details className="bg-muted/60 border-border mt-6 w-full max-w-lg rounded-lg border p-4 text-left">
        <summary className="text-muted-foreground cursor-pointer text-xs font-medium select-none">
          Error details
        </summary>
        <pre className="text-destructive/80 mt-3 overflow-x-auto text-xs leading-relaxed whitespace-pre-wrap">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </details>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => router.invalidate()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>

        {isRoot ? (
          <Link
            to="/"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-ring inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
        ) : (
          <Link
            to="/"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-ring inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            onClick={(e) => {
              e.preventDefault()
              window.history.back()
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Link>
        )}
      </div>
    </main>
  )
}

import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-primary text-7xl font-extrabold tracking-tight">404</p>
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Page not found</h1>
      <p className="text-muted-foreground mt-2 max-w-md">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
      >
        Go back home
      </Link>
    </main>
  )
}

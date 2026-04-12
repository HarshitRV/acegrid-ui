import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '#/services/hooks/auth'
import { useMyAttempts } from '#/services/hooks/attempt'
import { EmptyState } from '#/components/reusable/empty-state'
import { Button } from '#/components/ui/button'
import { ErrorAlert } from '#/components/reusable/error-alert'
import { BookOpen, Clock, Loader2, Trophy } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { user, isFetching: isAuthFetching } = useAuth()
  const attemptsQuery = useMyAttempts(!!user)
  const attempts = attemptsQuery.data?.attempts ?? []
  const completedAttempts = attempts.filter(
    (attempt) => attempt.status === 'completed',
  )
  const averageScore =
    completedAttempts.length > 0
      ? Math.round(
          completedAttempts.reduce(
            (total, attempt) =>
              total +
              ((attempt.score ?? 0) / Math.max(attempt.totalMarks, 1)) * 100,
            0,
          ) / completedAttempts.length,
        )
      : null

  if (isAuthFetching) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm">Loading dashboard...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <EmptyState
          title="Login Required"
          description="Please login to view your exam analytics and attempt history."
        />
        <div className="mt-4 flex justify-center gap-2">
          <Button asChild size="lg">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      </main>
    )
  }

  if (attemptsQuery.isPending) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm">Loading attempts...</p>
      </div>
    )
  }

  if (attemptsQuery.isError) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <ErrorAlert message={attemptsQuery.error.message} />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <section className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back, {user.name}.</p>
      </section>

      <section className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          {
            label: 'Exams Attempted',
            value: attempts.length,
            icon: <BookOpen className="text-primary size-4" />,
          },
          {
            label: 'Completed',
            value: completedAttempts.length,
            icon: <Trophy className="text-primary size-4" />,
          },
          {
            label: 'Avg Score',
            value: averageScore !== null ? `${averageScore}%` : '—',
            icon: <Trophy className="text-primary size-4" />,
          },
        ].map((stat) => (
          <article
            key={stat.label}
            className="flex items-center gap-3 rounded-xl border p-4"
          >
            <div className="bg-primary/10 rounded-md p-2">{stat.icon}</div>
            <div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-muted-foreground text-xs">{stat.label}</p>
            </div>
          </article>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Recent Attempts</h2>

        {attempts.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="text-muted-foreground mb-3 text-sm">
              No exams attempted yet.
            </p>
            <Button asChild size="lg">
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.map((attempt) => {
              const exam = attempt.examId
              const percentage =
                attempt.score !== null
                  ? Math.round((attempt.score / attempt.totalMarks) * 100)
                  : null

              return (
                <article
                  key={attempt._id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{exam.title}</p>
                    <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
                      <Clock className="size-3" />
                      {formatDistanceToNow(attempt.startedAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    {percentage !== null ? (
                      <span
                        className={`text-sm font-semibold ${
                          percentage >= 60 ? 'text-emerald-600' : 'text-orange-500'
                        }`}
                      >
                        {percentage}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs capitalize">
                        {attempt.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  {attempt.status === 'completed' ? (
                    <Button asChild variant="link" size="sm">
                      <Link
                        to="/exam/$examId/results/$attemptId"
                        params={{ examId: exam._id, attemptId: attempt._id }}
                      >
                        Review
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild variant="link" size="sm">
                      <Link to="/exam/$examId" params={{ examId: exam._id }}>
                        Resume
                      </Link>
                    </Button>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

function formatDistanceToNow(isoDate: string) {
  const distanceInSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000),
  )

  if (distanceInSeconds < 60) return 'just now'

  const distanceInMinutes = Math.floor(distanceInSeconds / 60)
  if (distanceInMinutes < 60) {
    return `${distanceInMinutes} minute${distanceInMinutes === 1 ? '' : 's'} ago`
  }

  const distanceInHours = Math.floor(distanceInMinutes / 60)
  if (distanceInHours < 24) {
    return `${distanceInHours} hour${distanceInHours === 1 ? '' : 's'} ago`
  }

  const distanceInDays = Math.floor(distanceInHours / 24)
  return `${distanceInDays} day${distanceInDays === 1 ? '' : 's'} ago`
}

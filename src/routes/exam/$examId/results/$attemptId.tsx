import { ErrorAlert } from '#/components/reusable/error-alert'
import { EmptyState } from '#/components/reusable/empty-state'
import { Button } from '#/components/ui/button'
import { useAuth } from '#/services/hooks/auth'
import { getAttemptByIdQueryOptions } from '#/services/hooks/attempt'
import { getExamsByIdQueryOptions } from '#/services/hooks/exam'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckCircle2, Circle, Loader2, Trophy, XCircle } from 'lucide-react'

export const Route = createFileRoute('/exam/$examId/results/$attemptId')({
  component: ExamResults,
})

function ExamResults() {
  const { examId, attemptId } = Route.useParams()
  const { user, isFetching: isAuthFetching } = useAuth()

  const attemptQuery = useQuery({
    ...getAttemptByIdQueryOptions(attemptId),
    enabled: !!user,
  })
  const examQuery = useQuery({
    ...getExamsByIdQueryOptions(examId),
    enabled: !!user,
  })

  if (isAuthFetching) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm">Loading user session...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <EmptyState
          title="Login Required"
          description="Please login to view attempt results."
        />
        <div className="mt-4 flex justify-center gap-2">
          <Button asChild size="lg">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/courses">Back to Courses</Link>
          </Button>
        </div>
      </main>
    )
  }

  if (attemptQuery.isPending || examQuery.isPending) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm">Loading results...</p>
      </div>
    )
  }

  if (attemptQuery.isError) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <ErrorAlert message={attemptQuery.error.message} />
      </main>
    )
  }

  if (examQuery.isError) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <ErrorAlert message={examQuery.error.message} />
      </main>
    )
  }

  const attempt = attemptQuery.data.attempt
  const examData = examQuery.data

  const percentage = Math.round(((attempt.score ?? 0) / attempt.totalMarks) * 100)
  const answeredCount = attempt.answers.filter(
    (answer) => answer.selectedIndex !== null,
  ).length
  const correctCount = examData.questions.reduce((correctAnswers, question) => {
    if (question.correctIndex === null) {
      return correctAnswers
    }

    const answer = attempt.answers.find(
      (attemptAnswer) => attemptAnswer.questionId === question._id,
    )
    return answer?.selectedIndex === question.correctIndex
      ? correctAnswers + 1
      : correctAnswers
  }, 0)
  const skippedCount = examData.questions.length - answeredCount

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <section className="mb-8 rounded-xl border p-8 text-center">
        <div className="bg-primary/10 mb-4 inline-flex size-16 items-center justify-center rounded-full">
          <Trophy className="text-primary size-8" />
        </div>
        <h1 className="mb-1 text-2xl font-bold">Exam Complete!</h1>
        <p className="text-muted-foreground mb-6">{examData.exam.title}</p>
        <p className="text-primary mb-2 text-5xl font-bold">{percentage}%</p>
        <p className="text-muted-foreground mb-6 text-sm">
          {attempt.score ?? 0} / {attempt.totalMarks} marks
        </p>

        <div className="grid grid-cols-3 gap-4 border-t pt-6 text-center">
          <div>
            <p className="text-2xl font-semibold">{answeredCount}</p>
            <p className="text-muted-foreground text-xs">Attempted</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-emerald-600">{correctCount}</p>
            <p className="text-muted-foreground text-xs">Correct</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-orange-500">{skippedCount}</p>
            <p className="text-muted-foreground text-xs">Skipped</p>
          </div>
        </div>
      </section>

      <section className="mb-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/exam/$examId" params={{ examId }}>
            Retake Exam
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/dashboard">Dashboard</Link>
        </Button>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Answer Review</h2>
        <div className="space-y-4">
          {examData.questions.map((question, index) => {
            const userAnswer = attempt.answers.find(
              (answer) => answer.questionId === question._id,
            )
            const selectedIndex = userAnswer ? userAnswer.selectedIndex : null
            const isSkipped = selectedIndex === null
            const isGated = question.correctIndex === null
            const isCorrect =
              !isSkipped && !isGated && selectedIndex === question.correctIndex

            return (
              <article key={question._id} className="rounded-xl border p-4">
                <div className="mb-3 flex items-start gap-3">
                  {isGated ? (
                    <Circle className="text-muted-foreground mt-0.5 size-5 shrink-0" />
                  ) : isSkipped ? (
                    <Circle className="text-muted-foreground mt-0.5 size-5 shrink-0" />
                  ) : isCorrect ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  ) : (
                    <XCircle className="text-destructive mt-0.5 size-5 shrink-0" />
                  )}

                  <p className="text-sm font-medium">
                    <span className="text-muted-foreground mr-2">
                      Q{index + 1}.
                    </span>
                    {question.text}
                  </p>
                </div>

                {!isGated && (
                  <div className="ml-8 space-y-1.5">
                    {question.options.map((option) => {
                      const isUserAnswer = selectedIndex === option.index
                      const isCorrectAnswer = question.correctIndex === option.index

                      let stateClass = 'border-transparent'
                      if (isCorrectAnswer) {
                        stateClass =
                          'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300'
                      } else if (isUserAnswer && !isCorrect) {
                        stateClass =
                          'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300'
                      }

                      return (
                        <div
                          key={option.index}
                          className={`rounded border px-3 py-1.5 text-xs ${stateClass}`}
                        >
                          {option.text}
                        </div>
                      )
                    })}

                    {question.explanation && (
                      <p className="text-muted-foreground mt-2 border-t pt-2 text-xs italic">
                        Hint: {question.explanation}
                      </p>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

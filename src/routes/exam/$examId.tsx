import { ErrorAlert } from '#/components/reusable/error-alert'
import { EmptyState } from '#/components/reusable/empty-state'
import { Button } from '#/components/ui/button'
import { useAuth } from '#/services/hooks/auth'
import { useStartAttempt, useSubmitAttempt } from '#/services/hooks/attempt'
import { getExamsByIdQueryOptions } from '#/services/hooks/exam'
import type { Attempt } from '#/types'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Lock,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/exam/$examId')({
  component: ExamPlayer,
})

const MS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60
const WARNING_THRESHOLD_SECONDS = 5 * SECONDS_PER_MINUTE
const CRITICAL_THRESHOLD_SECONDS = 1 * SECONDS_PER_MINUTE

function ExamPlayer() {
  const { examId } = Route.useParams()
  const navigate = useNavigate()
  const { user, isFetching: isAuthFetching } = useAuth()
  const { mutateAsync: startAttempt, isPending: isStartingAttempt } =
    useStartAttempt()
  const { mutateAsync: submitAttempt, isPending: isSubmittingAttempt } =
    useSubmitAttempt()
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Attempt.Answer[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [bootstrapError, setBootstrapError] = useState<string | null>(null)
  const [isBootstrapped, setIsBootstrapped] = useState(false)
  const isAutoSubmittedRef = useRef(false)

  const examQuery = useQuery({
    ...getExamsByIdQueryOptions(examId),
    enabled: !!user,
  })

  const examData = examQuery.data
  const totalQuestions = examData?.questions.length ?? 0
  const currentQuestion = examData?.questions[currentIndex] ?? null
  const answeredCount = useMemo(
    () => answers.filter((answer) => answer.selectedIndex !== null).length,
    [answers],
  )
  const progress =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0

  const currentAnswer =
    currentQuestion === null
      ? null
      : answers.find((answer) => answer.questionId === currentQuestion._id) ?? null

  const submitCurrentAttempt = useCallback(
    async ({ askConfirmation }: { askConfirmation: boolean }) => {
      if (!attemptId || isSubmittingAttempt) {
        return null
      }

      if (askConfirmation && typeof window !== 'undefined') {
        const shouldSubmit = window.confirm(
          `Submit exam? You've answered ${answeredCount}/${totalQuestions} questions.`,
        )
        if (!shouldSubmit) {
          return null
        }
      }

      try {
        const response = await submitAttempt({
          attemptId,
          answers,
        })

        toast.success('Exam submitted')
        navigate({
          to: '/exam/$examId/results/$attemptId',
          params: {
            examId,
            attemptId: response.attempt._id,
          },
        })

        return response.attempt
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Unable to submit attempt',
          {
            duration: Number.POSITIVE_INFINITY,
            closeButton: true,
          },
        )
        return null
      }
    },
    [
      answers,
      attemptId,
      answeredCount,
      examId,
      isSubmittingAttempt,
      navigate,
      submitAttempt,
      totalQuestions,
    ],
  )

  useEffect(() => {
    if (!user || !examData || isBootstrapped) {
      return
    }

    let cancelled = false

    const bootAttempt = async () => {
      try {
        const response = await startAttempt(examId)
        if (cancelled) {
          return
        }

        const attempt = response.attempt
        const startTime = new Date(attempt.startedAt).getTime()
        const expiresAt =
          startTime + examData.exam.duration * SECONDS_PER_MINUTE * MS_PER_SECOND
        const remainingSeconds = Math.max(
          0,
          Math.floor((expiresAt - Date.now()) / MS_PER_SECOND),
        )
        const firstUnansweredQuestionIndex = attempt.answers.findIndex(
          (answer) => answer.selectedIndex === null,
        )

        setAttemptId(attempt._id)
        setAnswers(attempt.answers)
        setCurrentIndex(
          firstUnansweredQuestionIndex === -1 ? 0 : firstUnansweredQuestionIndex,
        )
        setTimeRemaining(remainingSeconds)
        setBootstrapError(null)
        setIsBootstrapped(true)
        isAutoSubmittedRef.current = false
      } catch (error) {
        if (cancelled) {
          return
        }
        setBootstrapError(
          error instanceof Error ? error.message : 'Unable to start attempt',
        )
      }
    }

    void bootAttempt()

    return () => {
      cancelled = true
    }
  }, [examData, examId, isBootstrapped, startAttempt, user])

  useEffect(() => {
    if (!isBootstrapped || !attemptId) {
      return
    }

    const intervalId = window.setInterval(() => {
      setTimeRemaining((previous) => Math.max(0, previous - 1))
    }, MS_PER_SECOND)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [attemptId, isBootstrapped])

  useEffect(() => {
    if (
      !isBootstrapped ||
      !attemptId ||
      timeRemaining > 0 ||
      isAutoSubmittedRef.current
    ) {
      return
    }

    isAutoSubmittedRef.current = true
    void submitCurrentAttempt({ askConfirmation: false })
  }, [attemptId, isBootstrapped, submitCurrentAttempt, timeRemaining])

  const selectAnswer = (selectedIndex: number) => {
    if (!currentQuestion || currentQuestion.correctIndex === null) {
      return
    }

    setAnswers((previousAnswers) =>
      previousAnswers.map((answer) =>
        answer.questionId === currentQuestion._id
          ? { ...answer, selectedIndex }
          : answer,
      ),
    )
  }

  const goToQuestion = (index: number) => {
    if (index < 0 || index >= totalQuestions) {
      return
    }

    setCurrentIndex(index)
  }

  const goToNextQuestion = () => {
    setCurrentIndex((previous) => Math.min(previous + 1, totalQuestions - 1))
  }

  const goToPreviousQuestion = () => {
    setCurrentIndex((previous) => Math.max(previous - 1, 0))
  }

  const minutes = Math.floor(timeRemaining / SECONDS_PER_MINUTE)
  const seconds = timeRemaining % SECONDS_PER_MINUTE
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isWarning = timeRemaining <= WARNING_THRESHOLD_SECONDS
  const isCritical = timeRemaining <= CRITICAL_THRESHOLD_SECONDS

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
          icon={<Lock className="text-muted-foreground size-10" />}
          title="Login Required"
          description="Please sign in to start and submit exam attempts."
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

  if (examQuery.isPending || (!isBootstrapped && isStartingAttempt)) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm">Preparing exam...</p>
      </div>
    )
  }

  if (examQuery.isError) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <ErrorAlert message={examQuery.error.message} />
      </main>
    )
  }

  if (bootstrapError) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <ErrorAlert message={bootstrapError} />
      </main>
    )
  }

  if (!examData || !currentQuestion) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Unable to load exam questions.
      </div>
    )
  }

  const isCurrentQuestionLocked = currentQuestion.correctIndex === null

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div className="text-muted-foreground text-sm">
          Question <span className="text-foreground font-semibold">{currentIndex + 1}</span>{' '}
          / {totalQuestions}
        </div>
        <div
          className={`flex items-center gap-1.5 font-mono text-sm font-semibold ${
            isCritical
              ? 'text-destructive'
              : isWarning
                ? 'text-amber-500'
                : 'text-foreground'
          }`}
        >
          <Clock className="size-4" />
          {formattedTime}
        </div>
        <div className="text-muted-foreground text-sm">{answeredCount} answered</div>
      </header>

      <div className="bg-muted mb-8 h-1.5 w-full overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <section className="mb-6 rounded-xl border p-6">
        {isCurrentQuestionLocked ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="bg-muted rounded-full p-4">
              <Lock className="text-muted-foreground size-8" />
            </div>
            <p className="font-semibold">This question is locked</p>
            <p className="text-muted-foreground max-w-xs text-sm">
              You've reached the free question limit. Unlock full access to
              continue.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-base leading-relaxed font-medium">
              {currentQuestion.text}
            </p>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = currentAnswer?.selectedIndex === option.index

                return (
                  <button
                    key={option.index}
                    type="button"
                    onClick={() => selectAnswer(option.index)}
                    className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 font-medium'
                        : 'hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected
                          ? 'border-primary'
                          : 'border-muted-foreground/40'
                      }`}
                    >
                      {isSelected && <span className="bg-primary size-2 rounded-full" />}
                    </span>
                    {option.text}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </section>

      <section className="flex items-center justify-between">
        <Button
          variant="outline"
          size="lg"
          onClick={goToPreviousQuestion}
          disabled={currentIndex === 0 || isSubmittingAttempt}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>

        {currentIndex < totalQuestions - 1 ? (
          <Button size="lg" onClick={goToNextQuestion} disabled={isSubmittingAttempt}>
            Next
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={() => void submitCurrentAttempt({ askConfirmation: true })}
            disabled={isSubmittingAttempt}
          >
            {isSubmittingAttempt ? 'Submitting...' : 'Submit Exam'}
          </Button>
        )}
      </section>

      <section className="mt-8">
        <p className="text-muted-foreground mb-3 text-xs">Jump to question</p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const answer = answers.find(
              (currentAnswerRecord) =>
                currentAnswerRecord.questionId === examData.questions[index]._id,
            )
            const isAnswered =
              answer !== undefined && answer.selectedIndex !== null
            const isCurrent = index === currentIndex

            return (
              <button
                key={index}
                type="button"
                onClick={() => goToQuestion(index)}
                className={`h-8 w-8 rounded text-xs font-medium transition-colors ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : isAnswered
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      </section>
    </main>
  )
}

import { EmptyState } from '#/components/reusable/empty-state'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { useAuth } from '#/services/hooks/auth'
import { getCourseBySlugQueryOptions } from '#/services/hooks/courses'
import { getExamsQueryOptions } from '#/services/hooks/exam'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Clock, FileText, Loader2, Lock } from 'lucide-react'

export const Route = createFileRoute('/courses/$courseSlug')({
  loader: async ({ context: { queryClient }, params: { courseSlug } }) => {
    const courseResponse = await queryClient.ensureQueryData(
      getCourseBySlugQueryOptions(courseSlug),
    )

    await queryClient.ensureQueryData(getExamsQueryOptions(courseResponse.course._id))
  },
  pendingComponent: () => (
    <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
      <p className="text-muted-foreground text-sm">Loading course details...</p>
    </div>
  ),
  component: CourseDetail,
})

function CourseDetail() {
  const { courseSlug } = Route.useParams()
  const { user } = useAuth()
  const { data: courseData } = useSuspenseQuery(
    getCourseBySlugQueryOptions(courseSlug),
  )
  const { data: examsData } = useSuspenseQuery(
    getExamsQueryOptions(courseData.course._id),
  )

  const { course } = courseData
  const tags = course.tags ?? []
  const exams = examsData.data

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))
          ) : (
            <Badge variant="secondary" className="font-normal capitalize">
              {course.category}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-6">
          {course.description || 'Practice curated MCQ tests and track progress.'}
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Mock Tests &amp; Chapter Tests</h2>

        {exams.length === 0 ? (
          <EmptyState
            title="No exams available yet"
            description="Please check back soon for new test series."
          />
        ) : (
          <div className="space-y-3">
            {exams.map((exam) => (
              <article
                key={exam._id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{exam.title}</p>
                  <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" /> {exam.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="size-3" /> {exam.questionCount} questions
                    </span>
                    <span className="text-emerald-600">
                      {exam.freeQuestionCount} free
                    </span>
                  </div>
                </div>

                {user ? (
                  <Button asChild size="lg">
                    <Link to="/exam/$examId" params={{ examId: exam._id }}>
                      Start
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline" size="lg">
                    <Link to="/login">
                      <Lock className="size-3.5" />
                      Login to start
                    </Link>
                  </Button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'

import { useCourses } from '#/services/hooks/courses'
import { PageHeader } from '#/components/reusable/page-header'
import { CourseGridSkeleton } from '#/components/courses/course-grid-skeleton'
import { ErrorAlert } from '#/components/reusable/error-alert'
import { CourseGrid } from '#/components/courses/course-grid'
import { EmptyState } from '#/components/reusable/empty-state'

export const Route = createFileRoute('/courses')({
  component: Courses,
})

function Courses() {
  const { data, isPending, error } = useCourses()

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title="All Courses"
        description="Choose a course to start practising."
      />

      {isPending && <CourseGridSkeleton />}

      {error && <ErrorAlert message={error.message} />}

      {data && data.data.length > 0 && <CourseGrid courses={data.data} />}

      {data?.data.length === 0 && (
        <EmptyState
          icon={<BookOpen className="text-muted-foreground size-10" />}
          title="No courses found"
          description="We couldn't find any courses for the selected category."
        />
      )}
    </main>
  )
}

import { AdminHeader } from '#/components/admin/admin-header'
import { AdminCourseTable } from '#/components/admin/admin-courses/admin-course-table'
import { Button } from '#/components/ui/button'
import { getCoursesQueryOptions } from '#/services/hooks/courses'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PlusIcon, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/admin/courses/')({
  component: AdminCourses,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getCoursesQueryOptions()),
  pendingComponent: () => (
    <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
      <p className="text-muted-foreground text-sm">Loading courses...</p>
    </div>
  ),
})

function AdminCourses() {
  const navigate = useNavigate()
  const coursesQuery = useSuspenseQuery(getCoursesQueryOptions())
  const courses = coursesQuery.data

  return (
    <main>
      <AdminHeader
        title="Courses"
        description={`${courses.data.length} courses total | ${courses.data.reduce((acc, course) => acc + course.exams.length, 0)} exams total`}
      >
        <Button
          variant="default"
          size="lg"
          onClick={() => navigate({ to: '/admin/courses/add' })}
        >
          <PlusIcon className="mr-2 h-4 w-4" /> New Course
        </Button>
      </AdminHeader>
      <AdminCourseTable />
    </main>
  )
}

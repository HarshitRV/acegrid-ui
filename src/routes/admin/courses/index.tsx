import { AdminCourseHeader } from '#/components/admin-courses/admin-course-header'
import { AdminCourseTable } from '#/components/admin-courses/admin-course-table'
import { Button } from '#/components/ui/button'
import { useCourses } from '#/services/hooks/courses'
import { createFileRoute, Link } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'

export const Route = createFileRoute('/admin/courses/')({
  component: AdminCourses,
})

function AdminCourses() {
  const { data } = useCourses()

  return (
    <main>
      <AdminCourseHeader
        title="Courses"
        description={`${data?.data.length ?? 0} courses total`}
      >
        <Link to="/admin/courses/add">
          <Button variant="default" size="lg">
            <PlusIcon className="mr-2 h-4 w-4" /> New Course
          </Button>
        </Link>
      </AdminCourseHeader>
      <AdminCourseTable />
    </main>
  )
}

import { AdminCourseForm } from '#/components/admin-courses/admin-course-form'
import { AdminCourseHeader } from '#/components/admin-courses/admin-course-header'
import { Button } from '#/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

export const Route = createFileRoute('/admin/courses/add')({
  component: AdminCoursesAdd,
})

function AdminCoursesAdd() {
  return (
    <main>
      <AdminCourseHeader
        title="Add Course"
        description="Add a new course to the platform."
      >
        <Link to="/admin/courses">
          <Button variant="default" size="lg">
            <ChevronLeft className="mr-2 h-4 w-4" /> Courses List
          </Button>
        </Link>
      </AdminCourseHeader>
      <AdminCourseForm />
    </main>
  )
}

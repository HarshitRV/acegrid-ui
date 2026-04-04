import { AdminCourseForm } from '#/components/admin-courses/admin-course-form'
import { AdminCourseHeader } from '#/components/admin-courses/admin-course-header'
import { StickyPageLayout } from '#/components/reusable/containers/sticky-page-layout'
import { Button } from '#/components/ui/button'
import { useCourseById, useUpdateCourse } from '#/services/hooks/courses'
import type { Course } from '#/types'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/courses/$courseId')({
  component: EditCourse,
})

function EditCourse() {
  const navigate = useNavigate()
  const { courseId } = Route.useParams()
  const {
    data: courseData,
    isPending: isGetCoursePending,
    error,
  } = useCourseById(courseId)
  const { mutate: updateCourse, isPending: isUpdatePending } = useUpdateCourse()

  const handleUpdateCourse = (value: Course.CourseBody) => {
    updateCourse(
      { id: courseId, body: value },
      {
        onSuccess: () => {
          toast.success('Course updated')
        },
        onError: (err) => {
          toast.error(err.message, {
            duration: Number.POSITIVE_INFINITY,
            closeButton: true,
          })
        },
      },
    )
  }

  if (isGetCoursePending) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <p>Error: {error.message}</p>
      </div>
    )
  }

  return (
    <StickyPageLayout
      header={
        <AdminCourseHeader
          title="Edit Course"
          description="Edit course details."
        >
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate({ to: '/admin/courses' })}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Courses List
          </Button>
        </AdminCourseHeader>
      }
      footer={
        <div className="flex justify-start gap-2">
          <Button
            variant="default"
            size="lg"
            form="add-course-form"
            type="submit"
            disabled={isUpdatePending}
          >
            {isUpdatePending ? 'Updating...' : 'Update'}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate({ to: '/admin/courses' })}
            disabled={isUpdatePending}
          >
            Cancel
          </Button>
        </div>
      }
    >
      <AdminCourseForm formValues={courseData} onSubmit={handleUpdateCourse} />
    </StickyPageLayout>
  )
}

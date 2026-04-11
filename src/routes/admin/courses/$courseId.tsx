import { AdminCourseForm } from '#/components/admin/admin-courses/admin-course-form'
import { AdminHeader } from '#/components/admin/admin-header'
import { StickyPageLayout } from '#/components/reusable/containers/sticky-page-layout'
import { Button } from '#/components/ui/button'
import { formIdMap } from '#/constants'
import {
  getCourseByIdQueryOptions,
  useUpdateCourse,
} from '#/services/hooks/courses'
import type { Course } from '#/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const courseFormId = formIdMap.courseForm.id

export const Route = createFileRoute('/admin/courses/$courseId')({
  component: EditCourse,
  loader: ({ params: { courseId }, context: { queryClient } }) => {
    return queryClient.ensureQueryData(getCourseByIdQueryOptions(courseId))
  },
  pendingComponent: () => (
    <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
      <p className="text-muted-foreground text-sm">Loading course...</p>
    </div>
  ),
})

function EditCourse() {
  const navigate = useNavigate()
  const { courseId } = Route.useParams()
  const courseQuery = useSuspenseQuery(getCourseByIdQueryOptions(courseId))
  const courseData = courseQuery.data
  const { mutate: updateCourse, isPending: isUpdatePending } = useUpdateCourse()

  const handleUpdateCourse = (value: Course.CourseBody) => {
    updateCourse(
      { id: courseData.course._id, body: value },
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

  return (
    <StickyPageLayout
      header={
        <AdminHeader title="Edit Course" description="Edit course details.">
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate({ to: '/admin/courses' })}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Courses List
          </Button>
        </AdminHeader>
      }
      footer={
        <div className="flex justify-start gap-2">
          <Button
            variant="default"
            size="lg"
            form={courseFormId}
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
      <AdminCourseForm
        formValues={courseData.course}
        onSubmit={handleUpdateCourse}
        formId={courseFormId}
      />
    </StickyPageLayout>
  )
}

import { AdminCourseForm } from '#/components/admin/admin-courses/admin-course-form'
import { AdminCourseHeader } from '#/components/admin/admin-courses/admin-course-header'
import { StickyPageLayout } from '#/components/reusable/containers/sticky-page-layout'
import { Button } from '#/components/ui/button'
import { courseKeys, useAddCourse } from '#/services/hooks/courses'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import type { Course } from '#/types'
import { useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/admin/courses/add')({
  component: AddCourse,
})

function AddCourse() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useAddCourse()

  const handleSubmitCourse = (value: Course.CourseBody) => {
    mutate(value, {
      onSuccess: () => {
        toast.success('Course saved')
        queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
        navigate({ to: '/admin/courses' })
      },
      onError: (err) => {
        toast.error(err.message, {
          duration: Number.POSITIVE_INFINITY,
          closeButton: true,
        })
      },
    })
  }

  return (
    <StickyPageLayout
      header={
        <AdminCourseHeader
          title="Add Course"
          description="Add a new course to the platform."
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
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate({ to: '/admin/courses' })}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      }
    >
      <AdminCourseForm onSubmit={handleSubmitCourse} />
    </StickyPageLayout>
  )
}

import { AdminExamForm } from '#/components/admin/admin-exam/admin-exam-form'
import { AdminHeader } from '#/components/admin/admin-header'
import { StickyPageLayout } from '#/components/reusable/containers/sticky-page-layout'
import { Button } from '#/components/ui/button'
import { formIdMap } from '#/constants'
import { getCoursesQueryOptions } from '#/services/hooks/courses'
import { getExamsByIdQueryOptions, useUpdateExam } from '#/services/hooks/exam'
import type { Exam } from '#/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const examFormId = formIdMap.examForm.id

export const Route = createFileRoute('/admin/exams/$examId')({
  loader: ({ context: { queryClient }, params: { examId } }) => {
    queryClient.ensureQueryData(getCoursesQueryOptions())
    queryClient.ensureQueryData(getExamsByIdQueryOptions(examId))
  },
  component: EditExam,
  pendingComponent: () => (
    <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
      <p className="text-muted-foreground text-sm">Loading exam...</p>
    </div>
  ),
})

function EditExam() {
  const { examId } = Route.useParams()
  const navigate = useNavigate()
  const { data } = useSuspenseQuery(getExamsByIdQueryOptions(examId))
  const { mutate, isPending } = useUpdateExam()

  const handleEditExam = (value: Exam.AdminPatchExamBody) => {
    mutate(
      { id: examId, body: value },
      {
        onSuccess: () => {
          toast.success('Exam updated')
          navigate({ to: '/admin/exams' })
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
        <AdminHeader title="Update Exam" description="Update this exam details">
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate({ to: '/admin/exams' })}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Exams List
          </Button>
        </AdminHeader>
      }
      footer={
        <div className="flex justify-start gap-2">
          <Button
            variant="default"
            size="lg"
            form={examFormId}
            type="submit"
            disabled={isPending}
          >
            {isPending ? 'Updating...' : 'Update'}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate({ to: '/admin/exams' })}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      }
    >
      <AdminExamForm
        onSubmit={handleEditExam}
        formValues={data.exam}
        formId={examFormId}
      />
    </StickyPageLayout>
  )
}

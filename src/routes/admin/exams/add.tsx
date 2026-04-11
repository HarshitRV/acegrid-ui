import { AdminExamForm } from '#/components/admin/admin-exam/admin-exam-form'
import { AdminHeader } from '#/components/admin/admin-header'
import { StickyPageLayout } from '#/components/reusable/containers/sticky-page-layout'
import { Button } from '#/components/ui/button'
import { formIdMap } from '#/constants'
import { getCoursesQueryOptions } from '#/services/hooks/courses'
import { useAddExam } from '#/services/hooks/exam'
import type { Exam } from '#/types'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const examFormId = formIdMap.examForm.id

export const Route = createFileRoute('/admin/exams/add')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getCoursesQueryOptions()),
  component: AddExam,
  pendingComponent: () => (
    <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
      <p className="text-muted-foreground text-sm">Loading courses...</p>
    </div>
  ),
})

function AddExam() {
  const navigate = useNavigate()
  const { mutate, isPending } = useAddExam()

  const handleAddExam = (value: Exam.AdminCreateExamBody) => {
    mutate(value, {
      onSuccess: () => {
        toast.success('Exam saved')
        navigate({ to: '/admin/exams' })
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
        <AdminHeader
          title="Add Exam"
          description="Add a new exam to the platform."
        >
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
            {isPending ? 'Saving...' : 'Save'}
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
      <AdminExamForm onSubmit={handleAddExam} formId={examFormId} />
    </StickyPageLayout>
  )
}

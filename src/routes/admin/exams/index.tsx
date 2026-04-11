import { AdminExamTable } from '#/components/admin/admin-exam/admin-exam-table'
import { AdminHeader } from '#/components/admin/admin-header'
import { Button } from '#/components/ui/button'
import { getCoursesQueryOptions } from '#/services/hooks/courses'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Loader2, PlusIcon } from 'lucide-react'

export const Route = createFileRoute('/admin/exams/')({
  component: AdminExams,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getCoursesQueryOptions()),
  pendingComponent: () => (
    <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
      <p className="text-muted-foreground text-sm">Loading courses...</p>
    </div>
  ),
})

function AdminExams() {
  const navigate = useNavigate()

  return (
    <main>
      <AdminHeader title="Exams" description="Manage exams">
        <Button
          variant="default"
          size="lg"
          onClick={() => navigate({ to: '/admin/exams/add' })}
        >
          <PlusIcon className="mr-2 h-4 w-4" /> New Exam
        </Button>
      </AdminHeader>
      <AdminExamTable />
    </main>
  )
}

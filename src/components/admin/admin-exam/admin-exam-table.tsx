import { Button } from '#/components/ui/button'
import { DataTable } from '#/components/ui/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { modal } from '#/components/ui/global-modal'
import { getCourseByIdQueryOptions } from '#/services/hooks/courses'
import { getExamsQueryOptions, useDeleteExam } from '#/services/hooks/exam'
import type { Exam } from '#/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { Loader2, MoreVertical } from 'lucide-react'
import { Suspense } from 'react'
import { toast } from 'sonner'
import { ErrorBoundary } from 'react-error-boundary'
import { Skeleton } from '#/components/ui/skeleton'

const columns: ColumnDef<Exam.Exam>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'courseId',
    header: 'Course',
    cell: ({ row }) => <ExamCourseCell exam={row.original} />,
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
  },
  {
    accessorKey: 'totalMarks',
    header: 'Total Marks',
  },
  {
    accessorKey: 'questionCount',
    header: 'Questions',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString(),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => new Date(row.getValue('updatedAt')).toLocaleDateString(),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ExamActionCell exam={row.original} />,
  },
]

export function AdminExamTable() {
  const { data } = useSuspenseQuery(getExamsQueryOptions())

  return (
    <div className="mt-6">
      <DataTable columns={columns} data={data.data} />
    </div>
  )
}

function ExamCourseCell({ exam }: { exam: Exam.Exam }) {
  return (
    <ErrorBoundary
      fallback={
        <Link
          to="/admin/courses/$courseId"
          params={{ courseId: exam.courseId }}
          className="text-destructive hover:underline"
        >
          {exam.courseId}
        </Link>
      }
    >
      <Suspense fallback={<Skeleton className="h-4 w-full" />}>
        <ExamCourseCellContent courseId={exam.courseId} />
      </Suspense>
    </ErrorBoundary>
  )
}

function ExamCourseCellContent({ courseId }: { courseId: string }) {
  const { data } = useSuspenseQuery(getCourseByIdQueryOptions(courseId))

  return (
    <Link
      to="/admin/courses/$courseId"
      params={{ courseId }}
      className="text-blue-500"
    >
      {data.course.title}
    </Link>
  )
}

function ExamActionCell({ exam }: { exam: Exam.Exam }) {
  const navigate = useNavigate()
  const { mutateAsync: deleteExam } = useDeleteExam()

  const handleDeleteExam = async () => {
    modal.update({
      title: 'Deleting exam',
      description: 'Please wait while we delete this exam.',
      body: (
        <div className="flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Deleting...</span>
        </div>
      ),
      footer: undefined,
      showCloseButton: false,
      showFooterCloseButton: false,
      closeOnEscape: false,
      closeOnOutsideClick: false,
    })

    try {
      await deleteExam(exam._id)
      modal.close()
      toast.success('Exam deleted')
    } catch (error) {
      modal.close()
      toast.error(
        error instanceof Error ? error.message : 'Unable to delete exam',
        {
          duration: Number.POSITIVE_INFINITY,
          closeButton: true,
        },
      )
    }
  }

  const openDeleteModal = () => {
    modal.open({
      title: 'Delete course?',
      description: 'Are you sure you want to delete this?',
      body: (
        <p className="text-muted-foreground text-sm">
          This will permanently delete{' '}
          <span className="text-foreground font-medium">{exam.title}</span>.
        </p>
      ),
      showCloseButton: false,
      closeOnEscape: true,
      closeOnOutsideClick: true,
      footer: ({ close }) => (
        <>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteExam}>
            Delete
          </Button>
        </>
      ),
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onSelect={() => navigate({ to: `/admin/exams/${exam._id}` })}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={openDeleteModal}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

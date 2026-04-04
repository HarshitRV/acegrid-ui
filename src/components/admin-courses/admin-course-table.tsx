import { useCourses, useDeleteCourse } from '#/services/hooks/courses'
import type { Course } from '#/types/course'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '#/components/ui/data-table'
import { Loader2, MoreVertical } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { useNavigate } from '@tanstack/react-router'
import { modal } from '#/components/ui/global-modal'
import { toast } from 'sonner'

function CourseActionsCell({ course }: { course: Course }) {
  const navigate = useNavigate()
  const { mutateAsync: deleteCourse } = useDeleteCourse()

  const handleDeleteCourse = async () => {
    modal.update({
      title: 'Deleting course',
      description: 'Please wait while we delete this course.',
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
      await deleteCourse(course._id)
      modal.close()
      toast.success('Course deleted')
    } catch (error) {
      modal.close()
      toast.error(
        error instanceof Error ? error.message : 'Unable to delete course',
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
        <p className="text-sm text-muted-foreground">
          This will permanently delete <span className="font-medium text-foreground">{course.title}</span>.
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
          <Button variant="destructive" onClick={handleDeleteCourse}>
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
          onSelect={() => navigate({ to: `/admin/courses/${course._id}` })}
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

const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'examCount',
    header: 'Exam Count',
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
    cell: ({ row }) => <CourseActionsCell course={row.original} />,
  },
]

export function AdminCourseTable() {
  const { data, isPending, error, refetch } = useCourses()

  if (isPending) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <p>{error.message}</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <DataTable columns={columns} data={data.data} />
    </div>
  )
}

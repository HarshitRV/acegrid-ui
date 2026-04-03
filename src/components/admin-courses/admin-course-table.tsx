import { useCourses } from '#/services/hooks/courses'

import type { Course } from '#/types/course'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '#/components/ui/data-table'

export const columns: ColumnDef<Course>[] = [
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
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
  },
]

export function AdminCourseTable() {
  const { data } = useCourses()

  return (
    <div className="mt-6">
      <DataTable columns={columns} data={data?.data || []} />
    </div>
  )
}

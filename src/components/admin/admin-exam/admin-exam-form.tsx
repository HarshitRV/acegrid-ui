import { Card, CardContent } from '#/components/ui/card'
import { Exam } from '#/types'
import { FieldGroup } from '#/components/ui/field'
import { useAppForm } from '#/components/ui/app-form'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getCoursesQueryOptions } from '#/services/hooks/courses'

const defaultValues: Exam.AdminCreateExamBody = {
  courseId: '',
  title: '',
  description: '',
  duration: 1,
  totalMarks: 1,
}

interface AdminExamFormProps {
  onSubmit: (value: Exam.AdminCreateExamBody) => void
  formId: string
  formValues?: Exam.AdminCreateExamBody
}

export function AdminExamForm({
  onSubmit,
  formId,
  formValues,
}: AdminExamFormProps) {
  const isEditMode = !!formValues

  const form = useAppForm({
    defaultValues: formValues || defaultValues,
    validators: {
      onSubmit: Exam.AdminCreateExamBodySchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })

  const { data } = useSuspenseQuery(getCoursesQueryOptions())
  const courseOptions: { label: string; value: string }[] = data.data.map(
    (course) => ({
      label: course.title,
      value: course._id,
    }),
  )

  return (
    <Card className="mt-4">
      <CardContent>
        <form
          id={formId}
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.AppField
              name="courseId"
              children={(field) => (
                <field.SelectField
                  label="Course"
                  placeholder="Select course"
                  options={courseOptions}
                  groupLabel="Courses"
                  disabled={isEditMode}
                  info={
                    isEditMode
                      ? 'Course cannot be modified after creation.'
                      : undefined
                  }
                  required
                />
              )}
            />
            <form.AppField
              name="title"
              children={(field) => (
                <field.TextField
                  label="Title"
                  placeholder="Enter title"
                  required
                />
              )}
            />
            <form.AppField
              name="description"
              children={(field) => (
                <field.TextField
                  label="Description"
                  placeholder="A brief description of the exam..."
                />
              )}
            />
            <form.AppField
              name="duration"
              children={(field) => (
                <field.NumberField
                  label="Duration"
                  placeholder="Enter duration"
                  min={1}
                  required
                />
              )}
            />
            <form.AppField
              name="totalMarks"
              children={(field) => (
                <field.NumberField
                  label="Total Marks"
                  placeholder="Enter total marks"
                  min={1}
                  required
                />
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent } from '#/components/ui/card'
import { Course } from '#/types'
import { FieldGroup } from '#/components/ui/field'
import { useAppForm } from '#/components/ui/app-form'

const defaultValues: Course.CourseBody = {
  title: '',
  slug: '',
  description: '',
  category: 'other',
  tags: undefined,
  coverImage: undefined,
}

interface AdminCourseFormProps {
  onSubmit: (value: Course.CourseBody) => void
  formValues?: Course.CourseBody
}

export function AdminCourseForm({
  onSubmit,
  formValues,
}: AdminCourseFormProps) {
  const form = useAppForm({
    defaultValues: formValues || defaultValues,
    validators: {
      onSubmit: Course.CourseBodySchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })

  return (
    <Card className="mt-4">
      <CardContent>
        <form
          id="add-course-form"
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.AppField
              name="title"
              children={(field) => (
                <field.TextField
                  label="Title"
                  placeholder="CHS Entrance Exam"
                  required
                />
              )}
            />
            <form.AppField
              name="description"
              children={(field) => (
                <field.TextField
                  label="Description"
                  placeholder="A brief description of the course..."
                />
              )}
            />
            <form.AppField
              name="category"
              children={(field) => (
                <field.SelectField
                  label="Category"
                  placeholder="Select category"
                  options={Course.categories.map((c) => ({
                    label: c,
                    value: c,
                  }))}
                  groupLabel="Exam Categories"
                  required
                />
              )}
            />
            <form.AppField
              name="tags"
              children={(field) => (
                <field.TagField
                  label="Tags (comma-separated)"
                  placeholder="GS Paper, Polity, CUET"
                />
              )}
            />
            <form.AppField
              name="slug"
              children={(field) => (
                <field.TextField
                  label="Slug"
                  placeholder="GS Paper, Polity, CUET"
                  required
                />
              )}
            />
            <form.AppField
              name="coverImage"
              children={(field) => (
                <field.TextField
                  label="Cover Image"
                  placeholder="https://example.com/image.jpg"
                />
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

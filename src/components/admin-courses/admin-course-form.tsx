import { Card, CardContent } from '#/components/ui/card'
import { Course } from '#/types'
import { useForm } from '@tanstack/react-form'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'

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
}

export function AdminCourseForm({ onSubmit }: AdminCourseFormProps) {
  const form = useForm({
    defaultValues,
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
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field>
                    <FieldLabel htmlFor="title">
                      Title <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id="title"
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="CHS Entrance Exam"
                      required
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Input
                      id="description"
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="A brief description of the course..."
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="category"
              children={(field) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="category">
                      Category <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      required
                      name="category"
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(
                          Course.CourseCategorySchema.parse(value),
                        )
                      }
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Exam Categories</SelectLabel>
                          {Course.categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )
              }}
            />
            <form.Field
              name="tags"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field>
                    <FieldLabel htmlFor="tags">
                      {'Tags (comma-separated)'}
                    </FieldLabel>
                    <Input
                      id="tags"
                      name={field.name}
                      type="text"
                      defaultValue={field.state.value?.join(', ') || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value
                            ? e.target.value.split(',').map((tag) => tag.trim())
                            : undefined,
                        )
                      }
                      aria-invalid={isInvalid}
                      placeholder="GS Paper, Polity, CUET"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="slug"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field>
                    <FieldLabel htmlFor="slug">
                      {'Slug (must be unique and of format: exam-name-year)'}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id="slug"
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="GS Paper, Polity, CUET"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="coverImage"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field>
                    <FieldLabel htmlFor="coverImage">Cover Image</FieldLabel>
                    <Input
                      id="coverImage"
                      name={field.name}
                      type="text"
                      onBlur={field.handleBlur}
                      value={field.state.value || ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="https://example.com/image.jpg"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

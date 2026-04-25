import { AdminHeader } from '#/components/admin/admin-header'
import { getCoursesQueryOptions } from '#/services/hooks/courses'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useAppForm } from '#/components/ui/app-form'
import { z } from 'zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QuestionItem } from '#/components/admin/admin-question/question/question-item'
import type { Question } from '#/types/question'

export function TabsLine() {
  return (
    <Tabs defaultValue="overview">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export const Route = createFileRoute('/admin/questions/')({
  component: AdminQuestions,
  loader: ({ context: { queryClient } }) => {
    const courses = queryClient.ensureQueryData(getCoursesQueryOptions())
    return { courses }
  },
})

const FilterSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  examId: z.string().min(1, 'Exam is required'),
})

function AdminQuestions() {
  const { data: coursesData } = useSuspenseQuery(getCoursesQueryOptions())

  const form = useAppForm({
    defaultValues: {
      courseId: '',
      examId: '',
    },
    validators: {
      onSubmit: FilterSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('Query questions for', value)
      // Example of subsequent action:
      // navigate({ to: '/admin/questions/manage', search: value })
    },
  })

  const courseOptions = coursesData.data.map((course) => ({
    label: course.title,
    value: course._id,
  }))

  return (
    <main>
      <AdminHeader
        title="Questions"
        description="Manage questions for an exam of a particular course"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="mt-6 flex flex-wrap items-start gap-4 rounded-xl border p-4 shadow-sm">
          <div className="w-full min-w-48 flex-1">
            <form.AppField
              name="courseId"
              listeners={{
                onChange: () => {
                  form.setFieldValue('examId', '')
                },
              }}
              children={(field) => (
                <field.SelectField
                  label="Course"
                  groupLabel="Courses"
                  placeholder="Select a course"
                  options={courseOptions}
                  required
                />
              )}
            />
          </div>

          <form.Subscribe
            selector={(state) => state.values.courseId}
            children={(courseId) => {
              const selectedCourseData = coursesData.data.find(
                (_c) => _c._id === courseId,
              )
              const examOptions =
                selectedCourseData?.exams.map((exam) => ({
                  label: exam.title,
                  value: exam._id,
                })) || []

              return (
                <div className="w-full min-w-48 flex-1">
                  {courseId && examOptions.length === 0 ? (
                    <div className="flex h-full flex-col justify-center">
                      <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Exam
                      </label>
                      <div className="text-muted-foreground mt-[1em] text-sm">
                        No exams found in this course
                      </div>
                    </div>
                  ) : (
                    <form.AppField
                      name="examId"
                      children={(field) => (
                        <field.SelectField
                          label="Exam"
                          groupLabel="Exams"
                          placeholder="Select an exam"
                          options={examOptions}
                          disabled={!courseId}
                          required
                        />
                      )}
                    />
                  )}
                </div>
              )
            }}
          />
          {/* Probably: This is not need but let's come back to it later */}
          {/* <div className="flex pt-[22px]">
            <form.Subscribe
              selector={(state) => state.isSubmitting}
              children={(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting}>
                  Load Questions
                </Button>
              )}
            />
          </div> */}
        </div>
      </form>
      <div className="mt-6 rounded-xl border p-4 shadow-sm">
        <form.Subscribe
          selector={(state) => state.values}
          children={({ courseId, examId }) => {
            const courseAndExamSelected = courseId && examId
            if (!courseAndExamSelected) {
              return (
                <div className="text-muted-foreground text-sm">
                  Select courses and exam to configure them
                </div>
              )
            }

            return (
              <div>
                <Tabs defaultValue="questions">
                  <TabsList>
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                    <TabsTrigger value="add-single-question">
                      Add Single
                    </TabsTrigger>
                    <TabsTrigger value="add-bulk-questions">
                      Add Bulk
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="questions">
                    <QuestionsList />
                  </TabsContent>
                  <TabsContent value="add-single-question">
                    This is the form for adding a single question
                  </TabsContent>
                  <TabsContent value="add-bulk-questions">
                    This is the form for adding bulk questions
                  </TabsContent>
                </Tabs>
              </div>
            )
          }}
        />
      </div>
    </main>
  )
}

/** Mock question for development — replace with real data from useSuspenseQuery */
const MOCK_QUESTION: Question = {
  _id: 'q1',
  examId: 'exam1',
  text: 'Pick out the Abstract Noun from the following options:',
  options: [
    { index: 0, text: 'Would' },
    { index: 1, text: 'Doubt' },
    { index: 2, text: 'Should' },
    { index: 3, text: 'Could' },
  ],
  correctIndex: 1,
  explanation: null,
  isFree: true,
  tags: ['grammar', 'noun', 'abstract'],
  order: 0,
}

function QuestionsList() {
  // TODO: Replace with real data
  // const { data } = useSuspenseQuery(getExamsByIdQueryOptions(''));
  const questions = [MOCK_QUESTION]

  return (
    <div className="flex flex-col gap-4">
      {questions.map((q) => (
        <QuestionItem
          key={q._id}
          question={q}
          onDelete={(id) => console.log('Delete question:', id)}
          onUpdate={(id, data) => console.log('Update question:', id, data)}
        />
      ))}
    </div>
  )
}

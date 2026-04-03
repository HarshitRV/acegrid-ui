import { z } from 'zod'

export const ExamSchema = z.object({
  _id: z.string(),
  title: z.string(),
  courseId: z.string(),
  description: z.string().optional(),
  duration: z.number().int().positive().describe('Duration in minutes'),
  totalMarks: z.number().int().positive(),
  questionCount: z.number().int().nonnegative(),
  freeQuestionCount: z.number().int().nonnegative(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type Exam = z.infer<typeof ExamSchema>

export const ExamBodySchema = z.object({
    courseId: z.string(),
    title: z.string().min(2),
    description: z.string().optional(),
    duration: z.number().int().positive(),
    totalMarks: z.number().int().positive(),
});

export type ExamBody = z.infer<typeof ExamBodySchema>

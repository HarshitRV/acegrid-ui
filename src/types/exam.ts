import { z } from 'zod'
import { PaginatedResponseSchema } from './pagination'
import { QuestionSchema } from './question'

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

export const ListExamsQuerySchema = z.object({
  courseId: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
})
export type ListExamsQuery = z.infer<typeof ListExamsQuerySchema>

export const ListExamsResponseSchema = PaginatedResponseSchema(ExamSchema)
export type ListExamsResponse = z.infer<typeof ListExamsResponseSchema>

/** Exam detail with gated questions. */
export const GetExamResponseSchema = z.object({
  exam: ExamSchema,
  questions: z.array(QuestionSchema),
})
export type GetExamResponse = z.infer<typeof GetExamResponseSchema>

export const AdminCreateExamBodySchema = z.object({
  courseId: z.string().min(1, 'Please select a course'),
  title: z.string().min(2),
  description: z.string().optional(),
  duration: z.number().int().positive().describe('Duration in minutes'), // mins
  totalMarks: z.number().int().positive(),
})
export type AdminCreateExamBody = z.infer<typeof AdminCreateExamBodySchema>

export const AdminPatchExamBodySchema = AdminCreateExamBodySchema.omit({
  courseId: true,
}).partial()
export type AdminPatchExamBody = z.infer<typeof AdminPatchExamBodySchema>

/** Shape of an exam in admin API responses (no question stats). */
export const AdminExamSchema = z.object({
  _id: z.string(),
  title: z.string(),
  courseId: z.string(),
  description: z.string().optional(),
  duration: z.number().int().positive(),
  totalMarks: z.number().int().positive(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})
export type AdminExam = z.infer<typeof AdminExamSchema>

export const AdminCreateExamResponseSchema = z.object({
  exam: AdminExamSchema,
})
export type AdminCreateExamResponse = z.infer<
  typeof AdminCreateExamResponseSchema
>

export const AdminPatchExamResponseSchema = z.object({
  exam: AdminExamSchema,
})
export type AdminPatchExamResponse = z.infer<
  typeof AdminPatchExamResponseSchema
>

export const AdminDeleteExamResponseSchema = z.object({
  message: z.string(),
})
export type AdminDeleteExamResponse = z.infer<
  typeof AdminDeleteExamResponseSchema
>

import { z } from 'zod'

export const AnswerSchema = z.object({
  questionId: z.string(),
  selectedIndex: z.number().int().min(0).max(3).nullable(),
})

export type Answer = z.infer<typeof AnswerSchema>

export const AttemptStatusSchema = z.enum([
  'in_progress',
  'completed',
  'expired',
])

export type AttemptStatus = z.infer<typeof AttemptStatusSchema>

export const AttemptSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  examId: z.string(),
  answers: z.array(AnswerSchema),
  score: z.number().nullable(),
  totalMarks: z.number(),
  status: AttemptStatusSchema,
  startedAt: z.string().datetime(),
  submittedAt: z.string().datetime().nullable(),
})
export type Attempt = z.infer<typeof AttemptSchema>

export const StartAttemptInputSchema = z.object({
  examId: z.string(),
})
export type StartAttemptInput = z.infer<typeof StartAttemptInputSchema>

export const StartAttemptResponseSchema = z.object({
  attempt: AttemptSchema,
})
export type StartAttemptResponse = z.infer<typeof StartAttemptResponseSchema>

export const SubmitAttemptInputSchema = z.object({
  attemptId: z.string(),
  answers: z.array(AnswerSchema).min(1),
})

export type SubmitAttemptInput = z.infer<typeof SubmitAttemptInputSchema>

export const SubmitAttemptResponseSchema = z.object({
  attempt: AttemptSchema,
})
export type SubmitAttemptResponse = z.infer<typeof SubmitAttemptResponseSchema>

export const PopulatedExamSchema = z.object({
  _id: z.string(),
  title: z.string(),
  courseId: z.string(),
  duration: z.number(),
  totalMarks: z.number(),
})

export type PopulatedExam = z.infer<typeof PopulatedExamSchema>

export const AttemptWithExamSchema = AttemptSchema.omit({
  examId: true,
}).extend({
  examId: PopulatedExamSchema,
})

export type AttemptWithExam = z.infer<typeof AttemptWithExamSchema>

export const GetAttemptsHistoryResponseSchema = z.object({
  attempts: z.array(AttemptWithExamSchema),
})
export type GetAttemptsHistoryResponse = z.infer<
  typeof GetAttemptsHistoryResponseSchema
>

export const GetAttemptByIdResponseSchema = z.object({
  attempt: AttemptWithExamSchema,
})
export type GetAttemptByIdResponse = z.infer<
  typeof GetAttemptByIdResponseSchema
>

import { z } from 'zod'
import { PaginatedResponseSchema } from './pagination'
import { ExamSchema } from './exam'

/** Exam categories */
export const categories = [
  'government',
  'engineering',
  'medical',
  'management',
  'banking',
  'language',
  'other',
] as const

export const CourseCategorySchema = z.enum(categories)

export type CourseCategory = z.infer<typeof CourseCategorySchema>

export const CourseDescriptionSchema = z.union([
  z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(50, 'Description cannot exceed 50 characters'),
  z.literal(''),
])

export const CourseTagSchema = z
  .string()
  .min(2, 'Tag must be at least 2 characters')
  .max(30, 'Tag cannot exceed 30 characters')

export const CourseCoverImageSchema = z.union([
  z.url('Invalid URL'),
  z.literal(''),
])

export const CourseSchema = z.object({
  _id: z.string(),
  __v: z.number().optional(),
  title: z.string(),
  slug: z.string(),
  description: CourseDescriptionSchema.optional(),
  category: CourseCategorySchema,
  tags: z.array(CourseTagSchema).optional(),
  exams: z
    .array(z.object({ _id: z.string(), title: z.string() }))
    .optional()
    .default([]),
  coverImage: CourseCoverImageSchema.optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type Course = z.infer<typeof CourseSchema>

export const CoursesResponseSchema = PaginatedResponseSchema(CourseSchema)

export type CoursesResponse = z.infer<typeof CoursesResponseSchema>

export const CourseByIdResponseSchema = z.object({
  course: CourseSchema.omit({ exams: true }),
  exams: z.array(
    ExamSchema.omit({ questionCount: true, freeQuestionCount: true }),
  ),
})

export type CourseByIdResponse = z.infer<typeof CourseByIdResponseSchema>

export const CourseBodySchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(50, 'Title cannot exceed 50 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must be lowercase and contain no spaces (use hyphens instead)',
    )
    .max(50, 'Slug cannot exceed 50 characters'),
  description: CourseDescriptionSchema.optional(),
  category: CourseCategorySchema,
  tags: z.array(CourseTagSchema).optional(),
  coverImage: CourseCoverImageSchema.optional(),
})

export type CourseBody = z.infer<typeof CourseBodySchema>

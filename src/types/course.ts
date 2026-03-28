import { z } from 'zod'

export const CourseCategorySchema = z.enum([
  'government',
  'engineering',
  'medical',
  'management',
  'banking',
  'language',
  'other',
])

export type CourseCategory = z.infer<typeof CourseCategorySchema>

export const CourseSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  category: CourseCategorySchema,
  tags: z.array(z.string()),
  examCount: z.number().int().nonnegative(),
  coverImage: z.url().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type Course = z.infer<typeof CourseSchema>

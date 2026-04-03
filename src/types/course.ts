import { z } from 'zod'
import { PaginatedResponseSchema } from './pagination'

/** Exam categories */
export const categories = [
  'government',
  'engineering',
  'medical',
  'management',
  'banking',
  'language',
  'other',
] as const;

export const CourseCategorySchema = z.enum(categories)

export type CourseCategory = z.infer<typeof CourseCategorySchema>

export const CourseSchema = z.object({
  _id: z.string(),
  __v: z.number(),
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

export const CoursesResponseSchema = PaginatedResponseSchema(CourseSchema)

export type CoursesResponse = z.infer<typeof CoursesResponseSchema>

export const CourseBodySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(50, "Title cannot exceed 50 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase and contain no spaces (use hyphens instead)").max(50, "Slug cannot exceed 50 characters"),
  description: z.union([
    z.string().min(10, "Description must be at least 10 characters").max(50, "Description cannot exceed 50 characters"),
    z.literal('')
  ]).optional(),
  category: z.enum([
    "government",
    "engineering",
    "medical",
    "management",
    "banking",
    "language",
    "other",
  ]),
  tags: z.array(z.string().min(2, "Tag must be at least 2 characters").max(30, "Tag cannot exceed 30 characters")).optional(),
  coverImage: z.union([
    z.string().url("Invalid URL"),
    z.literal('')
  ]).optional(),
});

export type CourseBody = z.infer<typeof CourseBodySchema>

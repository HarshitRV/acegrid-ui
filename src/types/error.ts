import { z } from 'zod'

export const ApiErrorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
  }),
})

export type ApiError = z.infer<typeof ApiErrorSchema>

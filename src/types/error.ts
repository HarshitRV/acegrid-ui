import { z } from 'zod'

export const ApiErrorSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  errors: z.array(z.string()).optional(),
})

export type ApiError = z.infer<typeof ApiErrorSchema>

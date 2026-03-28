import { z } from 'zod'

export const UserSchema = z.object({
  _id: z.string(),
  name: z.string().min(2),
  email: z.email(),
  role: z.enum(['user', 'admin']).default('user'),
  purchasedExams: z.array(z.string()).default([]),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type User = z.infer<typeof UserSchema>

const AuthCredentialsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be at most 64 characters'),
})

export const RegisterInputSchema = AuthCredentialsSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

export type RegisterInput = z.infer<typeof RegisterInputSchema>

export const LoginInputSchema = AuthCredentialsSchema

export type LoginInput = z.infer<typeof LoginInputSchema>

export const AuthResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
})

export type AuthResponse = z.infer<typeof AuthResponseSchema>

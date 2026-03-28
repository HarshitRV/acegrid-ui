import type { User } from '#/types'
import { useMutation } from '@tanstack/react-query'
import client from '../client'

export const useLogin = () =>
  useMutation({
    mutationFn: ({ email, password }: User.LoginInput) =>
      client.auth.login({ email, password }),
  })

export const useRegister = () =>
  useMutation({
    mutationFn: ({ name, email, password }: User.RegisterInput) =>
      client.auth.register({ name, email, password }),
  })

import type { User } from '#/types'
import {
  queryOptions,
  skipToken,
  useMutation,
  useQuery,
} from '@tanstack/react-query'
import client from '../client'
import { SESSION_STORAGE_AUTH_TOKEN_KEY } from '#/constants'

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

export const getUserQueryOptions = (authToken: string | null) =>
  queryOptions({
    queryKey: ['user', { authToken }],
    queryFn: authToken ? () => client.auth.me(authToken) : skipToken,
  })

export const useAuth = () => {
  const authToken =
    typeof window !== 'undefined'
      ? sessionStorage.getItem(SESSION_STORAGE_AUTH_TOKEN_KEY)
      : null

  const { data, isError, isFetching } = useQuery(getUserQueryOptions(authToken))

  return { user: data?.user, isError, isFetching }
}

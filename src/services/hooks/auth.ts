import type { User } from '#/types'
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import client from '#/services/client'
import { SESSION_STORAGE_AUTH_TOKEN_KEY } from '#/constants'

export const authKeys = {
  all: ['user'] as const,
  user: () => [...authKeys.all] as const,
}

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, password }: User.LoginInput) =>
      client.auth.login({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.user(), user)
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, email, password }: User.RegisterInput) =>
      client.auth.register({ name, email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.user(), user)
    },
  })
}

export const getUserQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.user(),
    queryFn: () => {
      const token =
        typeof window !== 'undefined'
          ? sessionStorage.getItem(SESSION_STORAGE_AUTH_TOKEN_KEY)
          : null

      return token ? client.auth.me(token) : null
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

export const useAuth = () => {
  const { data, isError, isFetching } = useQuery(getUserQueryOptions())

  return { user: data?.user, isError, isFetching }
}

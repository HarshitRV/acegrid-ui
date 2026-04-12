import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import client from '#/services/client'
import type { Attempt } from '#/types'

export const attemptKeys = {
  all: ['attempts'] as const,
  lists: () => [...attemptKeys.all, 'list'] as const,
  list: () => [...attemptKeys.lists()] as const,
  details: () => [...attemptKeys.all, 'detail'] as const,
  detail: (id: string) => [...attemptKeys.details(), id] as const,
}

export const getMyAttemptsQueryOptions = () =>
  queryOptions({
    queryKey: attemptKeys.list(),
    queryFn: () => client.attempts.getMyAttempts(),
    staleTime: 0,
    refetchOnWindowFocus: false,
  })

export const useMyAttempts = (enabled = true) =>
  useQuery({
    ...getMyAttemptsQueryOptions(),
    enabled,
  })

export const getAttemptByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: attemptKeys.detail(id),
    queryFn: () => client.attempts.getAttemptById(id),
    staleTime: 0,
    refetchOnWindowFocus: false,
  })

export const useStartAttempt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (examId: string) => client.attempts.startAttempt({ examId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attemptKeys.lists() })
    },
  })
}

export const useSubmitAttempt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      attemptId,
      answers,
    }: {
      attemptId: string
      answers: Attempt.Answer[]
    }) => client.attempts.submitAttempt({ attemptId, answers }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: attemptKeys.detail(variables.attemptId) })
      queryClient.invalidateQueries({ queryKey: attemptKeys.lists() })
    },
  })
}

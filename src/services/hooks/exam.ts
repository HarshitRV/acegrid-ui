import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import client from '../client'
import type { AdminCreateExamBody, AdminPatchExamBody } from '#/types/exam'

export const examKeys = {
  all: ['exams'] as const,
  lists: () => [...examKeys.all, 'list'] as const,
  detail: (id: string) => [...examKeys.all, 'detail', id] as const,
}

export const getExamsQueryOptions = () =>
  queryOptions({
    queryKey: examKeys.lists(),
    queryFn: () => client.exams.getAllExams(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

export const getExamsByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: examKeys.detail(id),
    queryFn: () => client.exams.getExamById(id),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

export const useDeleteExam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => client.exams.deleteExam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examKeys.lists() })
    },
  })
}

export const useAddExam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: AdminCreateExamBody) => client.exams.createExam(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examKeys.lists() })
    },
  })
}

export const useUpdateExam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AdminPatchExamBody }) =>
      client.exams.updateExam(id, body),
    onSuccess: (updatedExam) => {
      /** Update the course in the cache, not invalidating the query, saves a refetch */
      queryClient.setQueryData(
        examKeys.detail(updatedExam.exam._id),
        updatedExam,
      )
      queryClient.invalidateQueries({ queryKey: examKeys.lists() })
    },
  })
}

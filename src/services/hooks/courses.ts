import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import client from '#/services/client'
import type { CourseBody, CourseCategory } from '#/types/course'

/** Course query key factory */
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (category?: CourseCategory) => [...courseKeys.lists(), { category }] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
}

/** Generates query options for fetching courses, optionally filtered by category */
export const getCoursesQueryOptions = (category?: CourseCategory) =>
  queryOptions({
    queryKey: courseKeys.list(category),
    queryFn: () => client.courses.getAllCourses({ category }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

/** Custom hook to fetch and cache the list of courses */
export const useCourses = (category?: CourseCategory) => {
  return useQuery(getCoursesQueryOptions(category))
}

/** Custom hook to create a new course and invalidate course lists on success */
export const useAddCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CourseBody) => client.courses.createCourse(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
    },
  })
}
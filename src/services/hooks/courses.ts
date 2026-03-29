import { queryOptions, useQuery } from '@tanstack/react-query'
import client from '#/services/client'
import type { CourseCategory } from '#/types/course'

export const getCoursesQueryOptions = (category?: CourseCategory) =>
  queryOptions({
    queryKey: ['courses', { category }],
    queryFn: () => client.courses.getAllCourses({ category }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

export const useCourses = (category?: CourseCategory) => {
  return useQuery(getCoursesQueryOptions(category))
}

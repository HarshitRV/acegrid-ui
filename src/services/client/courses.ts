import axios from 'axios'
import { fetchApi, getApiUrl, getHeaders } from '#/services/api'
import type { CourseCategory, CoursesResponse } from '#/types/course'

const coursesUrl = `${getApiUrl()}/courses`

export function getAllCourses({ category }: { category?: CourseCategory }) {
  let requestUrl = coursesUrl

  if (category) {
    requestUrl = `${coursesUrl}?category=${category}`
  }

  return fetchApi(
    axios.get<CoursesResponse>(requestUrl, {
      headers: getHeaders(),
    }),
  )
}

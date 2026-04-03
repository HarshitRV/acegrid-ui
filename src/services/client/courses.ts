import axios from 'axios'
import { fetchApi, getApiUrl, getAuthorizationHeaders, getHeaders } from '#/services/api'
import type { CourseBody, CourseCategory, CoursesResponse } from '#/types/course'

const coursesUrl = `${getApiUrl()}/courses`
const adminCourseUrl = `${getApiUrl()}/admin/courses`

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

export function createCourse(body: CourseBody) {
  return fetchApi(
    axios.post<CoursesResponse>(adminCourseUrl, body, {
      headers: getAuthorizationHeaders(),
    }),
  )
}
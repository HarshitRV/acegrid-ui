import axios from 'axios'
import { fetchApi, getApiUrl, getAuthorizationHeaders, getHeaders } from '#/services/api'
import type { CourseBody, CourseByIdResponse, CourseCategory, CoursesResponse } from '#/types/course'

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

export function getCourseById(id: string) {
  return fetchApi(
    axios.get<CourseByIdResponse>(`${adminCourseUrl}/${id}`, {
      headers: getAuthorizationHeaders(),
    }),
  )
}

export function updateCourse(id: string, body: CourseBody) {
  return fetchApi(
    axios.put<CourseByIdResponse>(`${adminCourseUrl}/${id}`, body, {
      headers: getAuthorizationHeaders(),
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

export function deleteCourse(id: string) {
  return fetchApi(
    axios.delete(`${adminCourseUrl}/${id}`, {
      headers: getAuthorizationHeaders(),
    }),
  )
}
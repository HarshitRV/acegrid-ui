import type {
  AdminCreateExamBody,
  AdminCreateExamResponse,
  AdminPatchExamBody,
  AdminPatchExamResponse,
  AdminDeleteExamResponse,
  ListExamsResponse,
  GetExamResponse,
} from '#/types/exam'
import axios from 'axios'
import {
  fetchApi,
  getApiUrl,
  getAuthorizationHeaders,
  getHeaders,
} from '#/services/api'

const examUrl = `${getApiUrl()}/exams`
const adminExamUrl = `${getApiUrl()}/admin/exams`

export const getAllExams = ({ courseId }: { courseId?: string } = {}) => {
  return fetchApi(
    axios.get<ListExamsResponse>(examUrl, {
      headers: getHeaders(),
      params: courseId ? { courseId } : undefined,
    }),
  )
}

export const getExamById = (id: string) => {
  return fetchApi(
    axios.get<GetExamResponse>(`${examUrl}/${id}`, {
      headers: getAuthorizationHeaders(),
    }),
  )
}

export const createExam = (body: AdminCreateExamBody) => {
  return fetchApi(
    axios.post<AdminCreateExamResponse>(adminExamUrl, body, {
      headers: getAuthorizationHeaders(),
    }),
  )
}

export const updateExam = (id: string, body: AdminPatchExamBody) => {
  return fetchApi(
    axios.patch<AdminPatchExamResponse>(`${adminExamUrl}/${id}`, body, {
      headers: getAuthorizationHeaders(),
    }),
  )
}

export const deleteExam = (id: string) => {
  return fetchApi(
    axios.delete<AdminDeleteExamResponse>(`${adminExamUrl}/${id}`, {
      headers: getAuthorizationHeaders(),
    }),
  )
}

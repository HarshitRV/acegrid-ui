import axios from 'axios'
import {
  fetchApi,
  getApiUrl,
  getAuthorizationHeaders,
} from '#/services/api'
import type { Attempt } from '#/types'

const attemptsUrl = `${getApiUrl()}/attempts`

export function startAttempt(body: Attempt.StartAttemptInput) {
  return fetchApi(
    axios.post<Attempt.StartAttemptResponse>(attemptsUrl, body, {
      headers: getAuthorizationHeaders(),
    }),
  )
}

export function submitAttempt({
  attemptId,
  answers,
}: {
  attemptId: string
  answers: Attempt.Answer[]
}) {
  const body: Attempt.SubmitAttemptInput = {
    attemptId,
    answers,
  }

  return fetchApi(
    axios.patch<Attempt.SubmitAttemptResponse>(
      `${attemptsUrl}/${attemptId}/submit`,
      body,
      {
        headers: getAuthorizationHeaders(),
      },
    ),
  )
}

export function getAttemptById(attemptId: string) {
  return fetchApi(
    axios.get<Attempt.GetAttemptByIdResponse>(`${attemptsUrl}/${attemptId}`, {
      headers: getAuthorizationHeaders(),
    }),
  )
}

export function getMyAttempts() {
  return fetchApi(
    axios.get<Attempt.GetAttemptsHistoryResponse>(`${attemptsUrl}/me`, {
      headers: getAuthorizationHeaders(),
    }),
  )
}

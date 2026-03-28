import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { HeaderOptions } from './types'

export const getApiUrl = (version: `v${number}` = 'v1') => {
  return `${import.meta.env.VITE_API_URL}/${version}/api`
}

export const getHeaders = (
  options?: HeaderOptions[],
): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  options?.forEach(({ key, value }) => {
    headers[key] = value
  })

  return headers
}

/**
 * A handy wrapper function for axios calls.
 * Extracts `data` on success, and extracts the correct backend error message on failure.
 */
export const fetchApi = async <T>(promise: AxiosPromise<T>): Promise<T> => {
  try {
    const res = await promise
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message
      throw new Error(message)
    }
    throw error
  }
}

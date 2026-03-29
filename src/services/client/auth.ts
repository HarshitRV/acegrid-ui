import type { User } from '#/types'
import axios from 'axios'
import { fetchApi, getApiUrl, getHeaders } from '#/services/api'

const authUrl = `${getApiUrl()}/auth`

export async function login({
  email,
  password,
}: User.LoginInput): Promise<User.AuthResponse> {
  return fetchApi(
    axios.post<User.AuthResponse>(
      `${authUrl}/login`,
      { email, password },
      {
        headers: getHeaders(),
      },
    ),
  )
}

export async function register({
  name,
  email,
  password,
}: User.RegisterInput): Promise<User.AuthResponse> {
  console.log('called')
  return fetchApi(
    axios.post<User.AuthResponse>(
      `${authUrl}/register`,
      { name, email, password },
      {
        headers: getHeaders(),
      },
    ),
  )
}

export async function me(authToken: string): Promise<User.AuthResponse> {
  return fetchApi(
    axios.get<User.AuthResponse>(`${authUrl}/me`, {
      headers: getHeaders([
        {
          key: 'Authorization',
          value: `Bearer ${authToken}`,
        },
      ]),
    }),
  )
}

import { api } from '@/lib/api'

export interface AuthenticateApiBody {
  email: string
  password: string
}

export interface AuthenticateApiResponse {
  token: string
}

export async function authenticateApi({
  email,
  password,
}: AuthenticateApiBody): Promise<AuthenticateApiResponse> {
  const { data } = await api.post<AuthenticateApiResponse>('/auth', {
    email,
    password,
  })

  return data
}

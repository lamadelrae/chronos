import { api } from '@/lib/api'
import type { User } from '@/types/user'

export async function getUserApi(): Promise<User> {
  const { data } = await api.get('/user')

  return data
}

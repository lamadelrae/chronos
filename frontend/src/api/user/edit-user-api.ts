import { api } from '@/lib/api'
import type { User } from '@/types/user'

export async function editUserApi(user: User): Promise<User> {
  const { data } = await api.put('/user', { ...user, userId: user.id })

  return data
}

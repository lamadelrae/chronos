import { api } from '@/lib/api'

export async function deleteDiaryEntry(id: string): Promise<void> {
  await api.delete(`/diary/${id}`)
}
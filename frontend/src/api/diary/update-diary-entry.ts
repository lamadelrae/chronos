import { api } from '@/lib/api'
import type { UpdateDiaryEntryRequest } from '@/types/diary'

export async function updateDiaryEntry(id: string, data: UpdateDiaryEntryRequest): Promise<void> {
  await api.put(`/diary/${id}`, data)
}
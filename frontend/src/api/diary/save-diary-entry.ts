import { api } from '@/lib/api'
import type { CreateDiaryEntryRequest } from '@/types/diary'

export async function saveDiaryEntry(data: CreateDiaryEntryRequest): Promise<void> {
  await api.post('/diary', data)
}
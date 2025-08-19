import { api } from '@/lib/api'
import type { DiaryEntry } from '@/types/diary'

export async function getDiaryEntries(date?: string): Promise<DiaryEntry[]> {
  const params = date ? { date } : {}
  const { data } = await api.get('/diary', { params })
  return data
}
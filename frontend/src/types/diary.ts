export interface DiaryEntry {
  id: string
  date: string
  title: string
  content: string
  createdAt: string
  lastUpdate: string
}

export interface CreateDiaryEntryRequest {
  date: string
  title: string
  content: string
}

export interface UpdateDiaryEntryRequest {
  title: string
  content: string
}
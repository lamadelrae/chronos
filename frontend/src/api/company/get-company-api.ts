import { api } from '@/lib/api'
import type { Company } from '@/types/company'

export async function getCompanyApi(): Promise<Company> {
  const { data } = await api.get('/user/company')

  return data
}

import { api } from '@/lib/api'
import type { Company } from '@/types/company'

export async function editCompanyApi(company: Company): Promise<Company> {
  const { data } = await api.put('/user/company', company)

  return data
}

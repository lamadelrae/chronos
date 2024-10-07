import type { QueryClient } from 'react-query'

import type { Company } from '@/types/company'

interface UpdateCompaniesCacheProps {
  queryClient: QueryClient
  company: Company
}

export function updateCompaniesCache({
  company,
  queryClient,
}: UpdateCompaniesCacheProps) {
  const cached = queryClient.getQueryData<Company>(['company'])

  if (cached) {
    queryClient.setQueryData(['company'], {
      ...cached,
      ...company,
    })
  }

  return { cached }
}

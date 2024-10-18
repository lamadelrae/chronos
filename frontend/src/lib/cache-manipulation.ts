import type { QueryClient } from 'react-query'

import type { Company } from '@/types/company'
import type { User } from '@/types/user'

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

interface UpdateUserCacheProps {
  queryClient: QueryClient
  user: User
}

export function updateUserCache({ user, queryClient }: UpdateUserCacheProps) {
  const cached = queryClient.getQueryData<User>(['user'])

  if (cached) {
    queryClient.setQueryData(['user'], {
      ...cached,
      ...user,
    })
  }

  return { cached }
}

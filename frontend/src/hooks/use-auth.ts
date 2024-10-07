import { useContext } from 'react'

import { authContext } from '@/contexts/auth-context'

export function useAuth() {
  return useContext(authContext)
}

'use client'

/* eslint-disable react-hooks/exhaustive-deps */

import { useRouter } from 'next/navigation'
import { parseCookies, setCookie } from 'nookies'
import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useMutation } from 'react-query'

import {
  authenticateApi,
  type AuthenticateApiBody,
} from '@/api/auth/authenticate-api'
import { getUserApi } from '@/api/user/get-user-api'
import { APP_COOKIES } from '@/constants/app-cookies'
import { api } from '@/lib/api'
import type { User } from '@/types/user'

interface AuthContextProps {
  isAuthenticated: boolean
  isLoading: boolean
  user: User
  signIn: (payload: AuthenticateApiBody) => Promise<void>
  signOut: () => Promise<void>
}

const DEFAULT_PROPS: AuthContextProps = {
  isLoading: true,
  isAuthenticated: false,
  signIn: async () => {},
  signOut: async () => {},
  user: {} as User,
}

export const authContext = createContext(DEFAULT_PROPS)

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  const [user, setUser] = useState<User>(DEFAULT_PROPS.user as User)
  const [isAuthenticated, setIsAuthenticated] = useState(
    DEFAULT_PROPS.isAuthenticated,
  )
  const [isLoading, setIsLoading] = useState(DEFAULT_PROPS.isLoading)

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: authenticateApi,
    mutationKey: ['authenticate'],
  })

  const { mutateAsync: getUser } = useMutation({
    mutationFn: getUserApi,
    mutationKey: ['get-user'],
  })

  const signIn = useCallback(
    async ({ email, password }: AuthenticateApiBody) => {
      const { token } = await authenticate({ email, password })
      if (!token) throw new Error('No token was provided')

      // Add token to the API for authenticated routes
      api.defaults.headers.Authorization = `Bearer ${token}`

      // Set authentication cookie on the browser
      setCookie(undefined, APP_COOKIES.AUTH_TOKEN, token, {
        maxAge: 60 * 60 * 24 * 14, // 14 days
        path: '/',
      })

      // Get user data
      const user = await getUser()
      if (!user) throw new Error('No user was provided')

      // End with user data
      setUser(user)
      setIsAuthenticated(true)

      router.push('/dashboard')
    },
    [],
  )

  const signOut = useCallback(async () => {
    setUser(DEFAULT_PROPS.user)
    setIsAuthenticated(DEFAULT_PROPS.isAuthenticated)

    router.push('/')
  }, [])

  useEffect(() => {
    setIsLoading(true)

    async function fetchExistingSession() {
      try {
        const cookies = parseCookies()
        const { [APP_COOKIES.AUTH_TOKEN]: token } = cookies

        if (!token) return

        api.defaults.headers.Authorization = `Bearer ${token}`

        // Get user data
        const user = await getUser()
        if (!user) throw new Error('No user was provided')

        // End with user data
        setUser(user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExistingSession()
  }, [])

  return (
    <authContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signOut,
        isLoading,
      }}
    >
      {children}
    </authContext.Provider>
  )
}

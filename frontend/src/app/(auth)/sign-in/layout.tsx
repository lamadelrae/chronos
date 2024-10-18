import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Sign in | Chronos',
}

export default function SignInLayout({ children }: { children: ReactNode }) {
  return children
}

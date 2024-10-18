import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Sign Up | Chronos',
}

export default function SignInLayout({ children }: { children: ReactNode }) {
  return children
}

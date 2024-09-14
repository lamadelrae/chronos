'use client'

import './globals.css'

import { Plus_Jakarta_Sans as plusJakartaSans } from 'next/font/google'
import { QueryClientProvider } from 'react-query'

import { Toaster } from '@/components/ui/sonner'
import { AuthContextProvider } from '@/contexts/auth-context'
import { queryClient } from '@/lib/query-client'

const jakartaSans = plusJakartaSans({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${jakartaSans.className} bg-background`}>
        <Toaster richColors position="bottom-center" />

        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>{children}</AuthContextProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}

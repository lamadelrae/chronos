'use client'

import type { ReactNode } from 'react'

import { AppHeader } from '@/components/app/navigation/app-header'
import { AppSidebar } from '@/components/app/navigation/app-sidebar'
import { FullScreenLoader } from '@/components/states/full-screen-loader'
import NotAuthenticated from '@/components/states/not-authenticated'
import { useAuth } from '@/hooks/use-auth'

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode
}) {
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return <FullScreenLoader />
  }

  if (!isAuthenticated) {
    return <NotAuthenticated />
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AppSidebar />
      <div className="flex flex-col md:gap-4 md:py-4 md:pl-14">
        <AppHeader />
        <main className="flex-1 p-4 md:px-6 md:py-0 md:gap-8">{children}</main>
      </div>
    </div>
  )
}

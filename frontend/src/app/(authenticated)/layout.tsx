import type { ReactNode } from 'react'

import { AppHeader } from '@/components/app/navigation/app-header'
import { AppSidebar } from '@/components/app/navigation/app-sidebar'

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AppSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <AppHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  )
}

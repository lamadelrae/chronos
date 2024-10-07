'use client'

import type { ReactNode } from 'react'

import { MarketingFooter } from '@/components/marketing/navigation/footer'
import { MarketingHeader } from '@/components/marketing/navigation/header'

export default function UnauthenticatedLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </>
  )
}

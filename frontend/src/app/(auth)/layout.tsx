'use client'

import type { ReactNode } from 'react'

export default function UnauthenticatedLayout({
  children,
}: {
  children: ReactNode
}) {
  return <main>{children}</main>
}

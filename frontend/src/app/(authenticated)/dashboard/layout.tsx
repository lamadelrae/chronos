import { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Dashboard | Chronos',
  description: 'Visão geral e estatísticas detalhadas do seu negócio.',
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children
}

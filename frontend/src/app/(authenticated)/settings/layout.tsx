import { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Configurações | Chronos',
  description: 'Visão geral e estatísticas detalhadas do seu negócio.',
}

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return children
}

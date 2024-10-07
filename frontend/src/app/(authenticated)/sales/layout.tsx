import { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Vendas | Chronos',
  description: 'Visão geral e estatísticas detalhadas do seu negócio.',
}

export default function SalesLayout({ children }: { children: ReactNode }) {
  return children
}

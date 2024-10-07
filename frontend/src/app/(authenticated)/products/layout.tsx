import { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Produtos | Chronos',
  description: 'Visão geral e estatísticas detalhadas do seu negócio.',
}

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return children
}

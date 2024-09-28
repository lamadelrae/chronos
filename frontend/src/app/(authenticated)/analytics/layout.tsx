import { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Análises | Chronos',
  description:
    'Visualize insights e previsões detalhadas sobre seu estoque e vendas.',
}

export default function AnalyticsLayout({ children }: { children: ReactNode }) {
  return children
}

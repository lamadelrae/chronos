import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Contato | Chronos',
  description:
    'Entre em contato conosco para obter mais informações sobre o Chronos, nossa solução de gestão inteligente de estoque.',
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}

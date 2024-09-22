import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Planos e Preços | Chronos',
  description:
    'Escolha o plano ideal para sua empresa. Oferecemos opções flexíveis para pequenas e médias empresas, com recursos avançados de gestão de estoque.',
}

export default function PricingLayout({ children }: { children: ReactNode }) {
  return children
}

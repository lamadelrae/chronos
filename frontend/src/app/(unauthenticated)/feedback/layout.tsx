import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feedback | Chronos',
  description:
    'Compartilhe suas opiniões e nos ajude a melhorar nosso serviço.',
}

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

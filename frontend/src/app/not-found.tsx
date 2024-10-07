import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <Typography variant="h6">404</Typography>

        <Typography variant="h2" className="mt-2">
          Página não encontrada
        </Typography>

        <Typography className="mt-6">
          Desculpe, mas não conseguimos encontrar a página requisitada
        </Typography>
        <div className="mt-10 flex items-center justify-center gap-x-2">
          <Button asChild variant="accent">
            <Link href="/">Ir para a home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Ajuda</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

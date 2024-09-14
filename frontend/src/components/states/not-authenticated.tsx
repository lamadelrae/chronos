import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'

export default function NotAuthenticated() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <Typography variant="h6">401</Typography>

        <Typography variant="h2" className="mt-2">
          Não autenticado
        </Typography>

        <Typography className="mt-6">
          Desculpe, mas você precisa estar autenticado para acessar esta página
        </Typography>
        <div className="mt-10 flex items-center justify-center gap-x-2">
          <Button asChild variant="accent">
            <Link href="/sign-in">Entrar</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/sign-up">Cadastrar</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

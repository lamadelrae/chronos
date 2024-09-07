import Link from 'next/link'

import { Button } from '@/components/ui/button'

export function HomeCTA() {
  return (
    <div className="bg-white">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            id="stop-losing-money"
          >
            Pare de perder dinheiro.
            <br />
            Maximize seus lucros.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Com nossa solução inteligente de gestão de estoque, você pode
            reduzir custos, evitar perdas e aumentar a eficiência do seu
            negócio. Deixe-nos ajudar você a alcançar o máximo potencial da sua
            empresa.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-4">
            <Button asChild variant="accent">
              <Link href="/auth/login" aria-describedby="stop-losing-money">
                Comece agora
              </Link>
            </Button>
            <Button asChild variant="link">
              <Link href="/auth/login" aria-describedby="stop-losing-money">
                Saiba mais
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'

export function HomeCTA() {
  return (
    <div className="bg-white">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Typography variant="h2" id="stop-losing-money">
            Pare de perder dinheiro.
            <br />
            Maximize seus lucros.
          </Typography>
          <Typography className="mx-auto mt-6 max-w-xl">
            Com nossa solução inteligente de gestão de estoque, você pode
            reduzir custos, evitar perdas e aumentar a eficiência do seu
            negócio. Deixe-nos ajudar você a alcançar o máximo potencial da sua
            empresa.
          </Typography>
          <div className="mt-10 flex items-center justify-center gap-x-4">
            <Button asChild variant="accent">
              <Link href="/sign-in" aria-describedby="stop-losing-money">
                Comece agora
              </Link>
            </Button>
            <Button asChild variant="link">
              <Link href="/sign-in" aria-describedby="stop-losing-money">
                Saiba mais
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

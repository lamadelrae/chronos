import { CheckIcon } from 'lucide-react'
import Link from 'next/link'

import { BrandGradient } from '@/components/brand-gradient'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { PLAN_OPTIONS } from '@/constants/plan-options'
import { formatCurrency } from '@/lib/formatters'
import { cn } from '@/lib/utils'

const PLANS_TO_SHOW = [PLAN_OPTIONS.starter, PLAN_OPTIONS.professional]

export function HomePricing() {
  return (
    <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <BrandGradient />

      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <Typography variant="h6">Planos</Typography>
        <Typography variant="h2" className="mt-2">
          O plano certo para o seu negócio
        </Typography>
      </div>
      <Typography className="mx-auto max-w-2xl mt-6 text-center">
        Escolha o plano que melhor se adapta às necessidades da sua empresa.
        Desde pequenos negócios até grandes redes varejistas, temos a solução
        ideal para otimizar seu estoque.
      </Typography>

      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {PLANS_TO_SHOW.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={cn(
              tier.featured
                ? 'relative bg-white shadow-2xl'
                : 'bg-white/60 sm:mx-8 lg:mx-0',
              tier.featured
                ? ''
                : tierIdx === 0
                  ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none'
                  : 'sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl',
              'rounded-3xl p-8 ring-1 ring-foreground/10 sm:p-10',
            )}
          >
            <Typography id={tier.id} variant="h6">
              {tier.name}
            </Typography>

            <div className="mt-4 flex items-baseline gap-x-2">
              <Typography variant="h2" className="text-4xl sm:text-5xl">
                {formatCurrency(tier.price.monthly / 100)}
              </Typography>
              <Typography className="text-muted-foreground/50">/mês</Typography>
            </div>

            <Typography className="mt-6">{tier.description}</Typography>

            <ul role="list" className="mt-8 space-y-3 sm:mt-10">
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-accent"
                  />
                  <Typography
                    variant="p"
                    className="text-foreground font-semibold text-sm"
                  >
                    {feature}
                  </Typography>
                </li>
              ))}
            </ul>

            <Button
              asChild
              variant={tier.featured ? 'accent' : 'outline'}
              className="mt-8 w-full"
            >
              <Link href="/sign-in" aria-describedby={tier.id}>
                Comece agora
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

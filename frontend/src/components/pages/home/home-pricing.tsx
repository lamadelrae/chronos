import { CheckIcon } from 'lucide-react'
import Link from 'next/link'

import { BrandGradient } from '@/components/brand-gradient'
import { Button } from '@/components/ui/button'
import { PLAN_OPTIONS } from '@/constants/plan-options'
import { formatCurrency } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export function HomePricing() {
  return (
    <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <BrandGradient />
      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <h2 className="text-base font-semibold leading-7 text-accent">
          Planos
        </h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          O plano certo para o seu negócio
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-muted-foreground">
        Escolha o plano que melhor se adapta às necessidades da sua empresa.
        Desde pequenos negócios até grandes redes varejistas, temos a solução
        ideal para otimizar seu estoque.
      </p>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {PLAN_OPTIONS.tiers.map((tier, tierIdx) => (
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
            <h3
              id={tier.id}
              className="text-base font-semibold leading-7 text-accent"
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-5xl font-bold tracking-tight text-foreground">
                {formatCurrency(tier.price.monthly / 100)}
              </span>
              <span className="text-base text-muted-foreground/50">/mês</span>
            </p>
            <p className="mt-6 text-base leading-7 text-muted-foreground">
              {tier.description}
            </p>
            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-foreground sm:mt-10"
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-accent"
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              asChild
              variant={tier.featured ? 'accent' : 'outline'}
              className="mt-8 w-full"
            >
              <Link href="/auth/sign-in" aria-describedby={tier.id}>
                Comece agora
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

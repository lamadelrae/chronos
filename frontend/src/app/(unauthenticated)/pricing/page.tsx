'use client'

import { CheckIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { PLAN_OPTIONS } from '@/constants/plan-options'
import { formatCurrency } from '@/lib/formatters'
import { cn } from '@/lib/utils'

const faqs = [
  {
    id: 2,
    question: 'Como funciona o período de teste gratuito?',
    answer:
      'Oferecemos um período de teste gratuito de 14 dias para todos os planos. Durante esse período, você terá acesso completo a todas as funcionalidades do plano escolhido, sem compromisso.',
  },
  {
    id: 3,
    question: 'Posso mudar de plano depois?',
    answer:
      'Sim, você pode atualizar ou fazer downgrade do seu plano a qualquer momento. As mudanças entrarão em vigor no próximo ciclo de faturamento.',
  },
  {
    id: 4,
    question: 'Quais métodos de pagamento são aceitos?',
    answer:
      'Aceitamos cartões de crédito das principais bandeiras, além de boleto bancário para pagamentos anuais.',
  },
  {
    id: 5,
    question: 'O suporte técnico está incluído em todos os planos?',
    answer:
      'Sim, todos os planos incluem suporte técnico. No entanto, o nível de prioridade e os canais de atendimento podem variar de acordo com o plano escolhido.',
  },
  {
    id: 6,
    question: 'Existe um limite de produtos que posso gerenciar?',
    answer:
      'O limite de produtos varia de acordo com o plano. O plano para pequenas empresas permite até 1.000 produtos, enquanto o plano para médias empresas suporta até 10.000 produtos.',
  },
  {
    id: 7,
    question: 'É possível cancelar a assinatura a qualquer momento?',
    answer:
      'Sim, você pode cancelar sua assinatura a qualquer momento. Não há taxas de cancelamento, e você terá acesso ao serviço até o final do período pago.',
  },
]

const DEFAULT_PRICING_FREQUENCY = PLAN_OPTIONS.frequencies[0]

export default function PricingPage() {
  const [frequency, setFrequency] = useState(DEFAULT_PRICING_FREQUENCY)

  function handleUpdateFrequency(value: string) {
    if (!value) return

    const selectedFrequency = PLAN_OPTIONS.frequencies.find(
      (fq) => fq.value === value,
    )

    if (!selectedFrequency) return

    setFrequency(selectedFrequency)
  }

  return (
    <>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-base font-semibold leading-7 text-accent">
            Planos
          </h1>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Preço simples, sem compromisso.
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-muted-foreground">
          Escolha um plano acessível repleto dos melhores recursos para otimizar
          seu estoque, aumentar a eficiência e impulsionar suas vendas.
        </p>
        <div className="mt-16 flex justify-center">
          <fieldset aria-label="Frequência de pagamento">
            <ToggleGroup
              type="single"
              value={frequency.value}
              onValueChange={handleUpdateFrequency}
              className="grid grid-cols-2 gap-x-1 rounded-full bg-white/90 py-1 px-2"
            >
              {PLAN_OPTIONS.frequencies.map((option) => (
                <ToggleGroupItem
                  id={option.value}
                  key={option.value}
                  value={option.value}
                  aria-label={option.value}
                  className="rounded-full text-center text-xs font-semibold h-8"
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </fieldset>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
          {PLAN_OPTIONS.tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                tier.mostPopular
                  ? 'ring-2 ring-accent bg-white'
                  : 'ring-1 ring-foreground/10 bg-white/60',
                'rounded-3xl p-8 xl:p-10',
              )}
            >
              <div className="flex items-center justify-between gap-x-4 relative">
                <h3
                  id={tier.id}
                  className={cn(
                    tier.mostPopular ? 'text-accent' : 'text-foreground',
                    'text-base font-semibold leading-7',
                  )}
                >
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold leading-5 text-accent-foreground absolute -top-0.5 right-0">
                    Mais popular
                  </p>
                ) : null}
              </div>
              <p className="mt-6 text-base leading-7 text-muted-foreground">
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  {formatCurrency(tier.price[frequency.value] / 100)}
                </span>
                <span className="text-base text-muted-foreground/50">
                  {frequency.priceSuffix}
                </span>
              </p>
              {frequency.value === 'annually' ? (
                <p className="text-accent text-sm -mt-2">2 meses grátis</p>
              ) : null}
              <Button
                asChild
                variant={tier.mostPopular ? 'accent' : 'outline'}
                className="mt-8 w-full"
              >
                <Link href="/auth/sign-in" aria-describedby={tier.id}>
                  Começar agora
                </Link>
              </Button>
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
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white px-6 sm:mt-56 lg:px-8 mt-24 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-foreground">
            Perguntas frequentes
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
            Tem uma pergunta diferente e não encontra a resposta que procura?
            Entre em contato com nossa equipe de suporte{' '}
            <Link
              href="#"
              className="font-semibold text-accent hover:text-accent/80"
            >
              enviando-nos um e-mail
            </Link>{' '}
            e responderemos o mais rápido possível.
          </p>
          <div className="mt-20">
            <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-3 lg:gap-x-10">
              {faqs.map((faq) => (
                <div key={faq.id}>
                  <dt className="text-base font-semibold leading-7 text-foreground">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </>
  )
}

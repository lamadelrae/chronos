'use client'

import { CheckIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { BrandGradient } from '@/components/brand-gradient'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Typography } from '@/components/ui/typography'
import { PLAN_FREQUENCIES } from '@/constants/plan-frequencies'
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

export default function PricingPage() {
  const [frequency, setFrequency] = useState<'yearly' | 'monthly'>('yearly')

  function handleUpdateFrequency(value: 'yearly' | 'monthly') {
    if (!value) return

    setFrequency(value)
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
        <BrandGradient />

        <div className="mx-auto max-w-4xl text-center">
          <Typography variant="h1">Preço simples, sem compromisso.</Typography>
        </div>

        <Typography className="mt-6 max-w-2xl mx-auto text-center">
          Escolha um plano acessível repleto dos melhores recursos para otimizar
          seu estoque, aumentar a eficiência e impulsionar suas vendas.
        </Typography>

        <div className="mt-16 flex justify-center">
          <fieldset aria-label="Frequência de pagamento">
            <ToggleGroup
              type="single"
              value={frequency}
              onValueChange={handleUpdateFrequency}
              className="grid grid-cols-2 gap-x-1 rounded-full bg-white/90 py-1 px-2"
            >
              {Object.values(PLAN_FREQUENCIES).map((option) => (
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
        <div className="isolate mx-auto mt-10 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {Object.values(PLAN_OPTIONS).map((tier) => (
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
                <Typography
                  id={tier.id}
                  variant="h6"
                  className={cn(
                    tier.mostPopular ? 'text-accent' : 'text-foreground',
                    'text-base font-semibold leading-7',
                  )}
                >
                  {tier.name}
                </Typography>
              </div>

              <Typography className="mt-6">{tier.description}</Typography>

              <div className="mt-6 flex items-baseline gap-x-1">
                <Typography
                  variant="h2"
                  className={cn({
                    'line-through blur-[2px]': tier.onRequest,
                  })}
                >
                  {formatCurrency((tier.price[frequency] as number) / 100)}
                </Typography>
                <Typography className="text-muted-foreground/50">
                  {tier.onRequest ? '' : '/mês'}
                </Typography>
              </div>

              {frequency === 'yearly' ? (
                <Typography className="text-accent text-sm">
                  2 meses grátis
                </Typography>
              ) : null}

              <Button
                asChild
                variant={
                  tier.onRequest
                    ? 'default'
                    : tier.mostPopular
                      ? 'accent'
                      : 'outline'
                }
                className="mt-8 w-full"
              >
                <Link
                  href={`${tier.onRequest ? '/contact' : '/sign-in'}`}
                  aria-describedby={tier.id}
                >
                  {tier.onRequest ? 'Entre em contato' : 'Começar agora'}
                </Link>
              </Button>

              <ul role="list" className="mt-8 space-y-3 sm:mt-10">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      aria-hidden="true"
                      className="h-6 w-5 flex-none text-accent"
                    />
                    <Typography variant="small" className="text-foreground">
                      {feature}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white px-6 lg:px-8 mt-24 py-20">
        <div className="mx-auto max-w-7xl">
          <Typography variant="h2">Perguntas frequentes</Typography>
          <Typography className="mt-6 max-w-2xl">
            Tem uma pergunta diferente e não encontra a resposta que procura?
            Entre em contato com nossa equipe de suporte{' '}
            <Link
              href="#"
              className="font-semibold text-accent hover:text-accent/80"
            >
              enviando-nos um e-mail
            </Link>{' '}
            e responderemos o mais rápido possível.
          </Typography>
          <div className="mt-20">
            <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-3 lg:gap-x-10">
              {faqs.map((faq) => (
                <div key={faq.id}>
                  <dt>
                    <Typography className="font-semibold text-foreground">
                      {faq.question}
                    </Typography>
                  </dt>
                  <dd>
                    <Typography className="mt-2">{faq.answer}</Typography>
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

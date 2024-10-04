import { Brain, Gauge, Zap } from 'lucide-react'
import Image from 'next/image'

import { Typography } from '@/components/ui/typography'

const features = [
  {
    name: 'Predição de Estoque Avançada',
    description:
      'Utilize algoritmos de machine learning de ponta para prever níveis de estoque, reduzindo custos de armazenamento e evitando rupturas.',
    icon: Brain,
  },
  {
    name: 'Previsão em Tempo Real',
    description:
      'Atualize suas previsões de demanda em tempo real com base em dados de vendas, mantendo seu estoque sempre otimizado.',
    icon: Zap,
  },
  {
    name: 'Indicadores de Desempenho',
    description:
      'Monitore KPIs cruciais, como faturamento, ticket médio, preço médio de venda, com dashboards intuitivos e personalizáveis.',
    icon: Gauge,
  },
]

export function HomeFeatures() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="absolute left-0 -translate-x-1/2 w-[40vw] h-full bg-gradient-to-r from-white via-white to-transparent hidden sm:block"></div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-10 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <Typography variant="h6">Revolucione seu estoque</Typography>

              <Typography variant="h2" className="mt-2">
                Gestão de estoque inteligente
              </Typography>

              <Typography className="mt-6">
                O Chronos utiliza tecnologia de ponta em machine learning para
                transformar sua gestão de estoque, proporcionando insights
                precisos e acionáveis para otimizar seu negócio.
              </Typography>

              <dl className="mt-10 max-w-xl space-y-8 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute left-1 top-1 h-5 w-5 text-accent"
                      />
                      <Typography className="font-semibold text-foreground inline">
                        {feature.name}
                      </Typography>
                    </dt>{' '}
                    <dd className="inline">
                      <Typography className="inline">
                        {feature.description}
                      </Typography>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="flex items-start justify-end lg:order-first">
            <Image
              alt="Chronos dashboard"
              src="/marketing/marketing_dashboard_preview.webp"
              width={1600}
              height={960}
              className="w-[48rem] max-w-none rounded-xl sm:w-[57rem]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

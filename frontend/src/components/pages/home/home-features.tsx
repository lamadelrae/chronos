import { Brain, Gauge, Zap } from 'lucide-react'
import Image from 'next/image'

const features = [
  {
    name: 'Predição de Estoque Avançada',
    description:
      'Utilize algoritmos de machine learning de ponta para prever níveis de estoque com precisão incrível, reduzindo custos de armazenamento e evitando rupturas.',
    icon: Brain,
  },
  {
    name: 'Previsão de Demanda em Tempo Real',
    description:
      'Atualize suas previsões de demanda em tempo real com base em dados de vendas, tendências de mercado e eventos externos, mantendo seu estoque sempre otimizado.',
    icon: Zap,
  },
  {
    name: 'Indicadores de Desempenho de Estoque',
    description:
      'Monitore KPIs cruciais de estoque, como giro de estoque, cobertura e precisão de previsão, com dashboards intuitivos e personalizáveis.',
    icon: Gauge,
  },
]

export function HomeFeatures() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-10 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-accent">
                Revolucione seu estoque
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Gestão de estoque inteligente
              </p>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                O Chronos utiliza tecnologia de ponta em machine learning para
                transformar sua gestão de estoque, proporcionando insights
                precisos e acionáveis para otimizar seu negócio.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-muted-foreground lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-foreground">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute left-1 top-1 h-5 w-5 text-accent"
                      />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
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
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-foreground/10 sm:w-[57rem]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

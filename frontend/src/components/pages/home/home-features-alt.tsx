import {
  BarChart4,
  Brain,
  Coins,
  ShoppingCart,
  TrendingUp,
  Zap,
} from 'lucide-react'

const features = [
  {
    name: 'Previsão de Demanda',
    description:
      'Utilize machine learning avançado para prever com precisão a demanda futura de produtos, otimizando seu estoque e reduzindo perdas.',
    icon: Brain,
  },
  {
    name: 'Análise de Tendências',
    description:
      'Identifique padrões de compra e tendências sazonais para tomar decisões estratégicas e antecipar-se às mudanças do mercado.',
    icon: TrendingUp,
  },
  {
    name: 'Gestão de Estoque Inteligente',
    description:
      'Mantenha níveis ótimos de estoque com recomendações automáticas de reposição, evitando excessos e rupturas.',
    icon: ShoppingCart,
  },
  {
    name: 'Dashboards Personalizados',
    description:
      'Visualize dados críticos em tempo real com dashboards intuitivos e personalizáveis, facilitando a tomada de decisões rápidas.',
    icon: BarChart4,
  },
  {
    name: 'Integração em Tempo Real',
    description:
      'Conecte-se facilmente com seus sistemas existentes para uma visão unificada e atualizada do seu negócio.',
    icon: Zap,
  },
  {
    name: 'Otimização de Custos',
    description:
      'Reduza custos de armazenamento e aumente o giro de estoque com sugestões baseadas em dados para maximizar seus lucros.',
    icon: Coins,
  },
]

export function HomeFeaturesAlt() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Recursos poderosos para sua gestão de estoque
          </h2>
          <dl className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.name}>
                <dt className="text-base font-semibold leading-7 text-foreground">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <feature.icon
                      aria-hidden="true"
                      className="h-6 w-6 text-background"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 text-base leading-7 text-muted-foreground">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

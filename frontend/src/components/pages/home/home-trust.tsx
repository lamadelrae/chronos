import { Typography } from '@/components/ui/typography'

const stats = [
  { id: 1, name: 'Processamento de dados', value: '1M+/s' },
  { id: 2, name: 'Tempo médio de processamento', value: '24h' },
  { id: 3, name: 'Precisão de análise', value: '+90%' },
  { id: 4, name: 'Dados processados', value: '10GB+' },
]

export function HomeTrust() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <Typography variant="h2">
              Processamento de dados históricos poderoso e eficiente
            </Typography>
            <Typography className="mt-6">
              O Chronos oferece capacidade incomparável de processamento
              automático e rápido de grandes volumes de dados históricos.
            </Typography>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col bg-foreground/5 p-8">
                <dt>
                  <Typography variant="small">{stat.name}</Typography>
                </dt>
                <dd className="order-first">
                  <Typography variant="h3">{stat.value}</Typography>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

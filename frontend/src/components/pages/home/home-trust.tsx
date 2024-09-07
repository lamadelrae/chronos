const stats = [
  { id: 1, name: 'Processamento de dados históricos', value: '1M+/s' },
  { id: 2, name: 'Tempo médio de processamento', value: '< 50ms' },
  { id: 3, name: 'Precisão de análise', value: '+90%' },
  { id: 4, name: 'Dados processados', value: '10GB+' },
]

export function HomeTrust() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Processamento de dados históricos poderoso e eficiente
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              O Chronos oferece capacidade incomparável de processamento
              automático e rápido de grandes volumes de dados históricos.
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col bg-gray-400/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">
                  {stat.name}
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

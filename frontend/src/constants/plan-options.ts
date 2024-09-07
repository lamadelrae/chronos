interface PlanFrequency {
  value: 'monthly' | 'annually'
  label: string
  priceSuffix: string
}

export const PLAN_OPTIONS = {
  frequencies: [
    { value: 'annually', label: 'Anual', priceSuffix: '/ano' },
    { value: 'monthly', label: 'Mensal', priceSuffix: '/mês' },
  ] as PlanFrequency[],
  tiers: [
    {
      name: 'Pequenas empresas',
      id: 'small-business',
      price: {
        monthly: 39900,
        annually: 399000,
      },
      description:
        'Ideal para pequenas empresas e médias que estão começando a otimizar e melhorar seu estoque.',
      features: [
        'Até 1.000 produtos',
        'Previsão de demanda básica',
        'Análise de estoque',
        'Alertas de reposição',
        'Suporte por email',
        'Integrações limitadas',
      ],
      maxUsers: 5,
      storageLimit: '5GB',
      apiRequests: '10.000/mês',
      featured: false,
      mostPopular: true,
    },
    {
      name: 'Médias empresas',
      id: 'medium-business',
      price: {
        monthly: 79900,
        annually: 799000,
      },
      description:
        'Perfeito para empresas em crescimento que precisam de recursos avançados de gestão de estoque.',
      features: [
        'Até 10.000 produtos',
        'Previsão de demanda avançada',
        'Análise de estoque em tempo real',
        'Otimização automática de pedidos',
        'Suporte prioritário 24/7',
        'Integrações ilimitadas',
        'Relatórios personalizados',
        'API completa',
      ],
      maxUsers: 20,
      storageLimit: '50GB',
      apiRequests: '100.000/mês',
      featured: true,
      mostPopular: false,
    },
  ],
}

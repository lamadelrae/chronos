export const PLAN_OPTIONS = {
  starter: {
    name: 'Starter',
    id: 'starter',
    price: {
      monthly: 4990,
      yearly: (4990 * 10) / 12,
    },
    description:
      'Ideal para pequenas empresas que estão começando a otimizar e melhorar seu estoque.',
    features: [
      'Até 100 produtos',
      'Até 1.000 predições',
      'Previsão de demanda básica',
      'Análise de estoque',
    ],
    maxUsers: 1,
    apiRequests: '1.000/mês',
    featured: false,
    mostPopular: false,
    onRequest: false,
  },
  professional: {
    name: 'Professional',
    id: 'professional',
    price: {
      monthly: 14990,
      yearly: (14990 * 10) / 12,
    },
    description:
      'Perfeito para empresas em crescimento que precisam de recursos de previsão de demanda.',
    features: [
      'Até 500 produtos',
      'Até 5.000 predições',
      'Previsão de demanda avançada',
      'Análise de estoque em tempo real',
      'Otimização automática de pedidos',
      '1 Consultoria/Mês',
    ],
    maxUsers: 5,
    apiRequests: '5.000/mês',
    featured: true,
    mostPopular: true,
    onRequest: false,
  },
  exclusive: {
    name: 'Exclusive',
    id: 'exclusive',
    price: {
      monthly: 29990,
      yearly: (29990 * 10) / 12,
    },
    description:
      'Para empresas que necessitam de soluções personalizadas para gestão de estoque.',
    features: [
      'Até 2.000 produtos',
      'Até 20.000 predições',
      'Previsão de demanda avançada',
      'Análise de estoque em tempo real',
      'Otimização automática de pedidos',
      'Integrações personalizadas',
      '3 Consultorias/Mês',
    ],
    maxUsers: 10,
    apiRequests: '20.000/mês',
    featured: true,
    mostPopular: false,
    onRequest: false,
  },
  enterprise: {
    name: 'Enterprise',
    id: 'enterprise',
    price: {
      monthly: 39990,
      yearly: (39990 * 10) / 12,
    },
    description:
      'Solução completa e personalizada para grandes empresas com necessidades complexas.',
    features: [
      'Produtos ilimitados',
      'Predições ilimitadas',
      'Previsão de demanda avançada',
      'Análise de estoque em tempo real',
      'Otimização automática de pedidos',
      'Integrações personalizadas',
      '10 Consultorias/Mês',
    ],
    maxUsers: 'Ilimitado',
    apiRequests: 'Ilimitado',
    featured: true,
    mostPopular: false,
    onRequest: true,
  },
}

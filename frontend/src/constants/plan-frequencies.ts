export type PlanFrequencyValue = 'monthly' | 'yearly'

export interface PlanFrequency {
  value: PlanFrequencyValue
  label: string
  priceSuffix: string
}

export const PLAN_FREQUENCIES: Record<PlanFrequencyValue, PlanFrequency> = {
  yearly: { value: 'yearly', label: 'Anual', priceSuffix: '/ano' },
  monthly: { value: 'monthly', label: 'Mensal', priceSuffix: '/mês' },
}

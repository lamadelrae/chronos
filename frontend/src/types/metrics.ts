export interface MetricDay {
  date: string
  saleQuantity: number
  total: number
  averageTicket: number
  productQuantitySold: number
  averageSellingPrice: number
}

export interface Metric {
  year: number
  month: number
  saleQuantity: number
  total: number
  averageTicket: number
  productQuantitySold: number
  averageSellingPrice: number
  days: MetricDay[]
}

export interface Metrics {
  current: Metric
  last: Metric
}

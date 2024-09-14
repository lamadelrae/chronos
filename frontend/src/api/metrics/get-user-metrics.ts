import { api } from '@/lib/api'

interface GetUserMetricsResponseItem {
  year: number
  month: number
  saleQuantity: number
  total: number
  averageTicket: number
  productQuantitySold: number
  averageSellingPrice: number
  days: Array<{
    date: string
    saleQuantity: number
    total: number
    averageTicket: number
    productQuantitySold: number
    averageSellingPrice: number
  }>
}

export interface GetUserMetricsResponse {
  current: GetUserMetricsResponseItem
  last: GetUserMetricsResponseItem
}

export async function getUserMetrics(): Promise<GetUserMetricsResponse> {
  const { data } = await api.get<GetUserMetricsResponse>('/user/metrics')

  return data
}

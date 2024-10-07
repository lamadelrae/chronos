import moment from 'moment'

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

export interface GetUserMetricsProps {
  date: string | Date
}

export async function getUserMetrics({
  date = new Date(),
}: GetUserMetricsProps): Promise<GetUserMetricsResponse> {
  const formattedDate = moment(date).endOf('month').format('YYYY-MM-DD')

  const { data } = await api.get<GetUserMetricsResponse>(
    `/user/metrics?date=${formattedDate}`,
  )

  return data
}

import { format } from 'date-fns'

import { api } from '@/lib/api'

export interface GetSalesBody {
  page: number
  size?: number | null
  start?: string | null
  end?: string | null
  sortBy?: string | null
  ascending?: boolean | null
}

export interface SaleItem {
  productId: string
  name: string
  price: number
  quantity: number
}

export interface GetSalesResponse {
  data: Array<{
    id: string
    date: string
    total: number
    items: Array<SaleItem>
  }>

  totalItems: number
  pageCount: number
  pageSize: number
  currentPage: number
}

export async function getSalesApi({
  page = 0,
  size = 10,
  start,
  end,
  ascending,
  sortBy,
}: GetSalesBody): Promise<GetSalesResponse> {
  let API_URL = `/user/sale?page=${page}&size=${size}`

  if (start) {
    const startDate = format(start, 'yyyy-MM-dd')
    API_URL += `&start=${startDate}`
  }

  if (end) {
    const endDate = format(end, 'yyyy-MM-dd')
    API_URL += `&end=${endDate}`
  }

  if (ascending !== undefined) {
    API_URL += `&ascending=${ascending}`
  }

  if (sortBy !== undefined) {
    API_URL += `&sortBy=${sortBy}`
  }

  const { data } = await api.get<GetSalesResponse>(API_URL)

  return data
}

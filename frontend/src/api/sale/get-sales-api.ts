import { api } from '@/lib/api'

export interface GetSalesBody {
  page: number
  size: number
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
}: GetSalesBody): Promise<GetSalesResponse> {
  const { data } = await api.get<GetSalesResponse>(
    `/user/sale?page=${page}&size=${size}`,
  )

  return data
}

import { api } from '@/lib/api'

export interface GetProductsBody {
  page: number
  size: number
}

export interface GetProductsResponse {
  data: Array<{
    id: string
    name: string
    price: number
  }>

  totalItems: number
  pageCount: number
  pageSize: number
  currentPage: number
}

export async function getProductsApi({
  page = 0,
  size = 10,
}: GetProductsBody): Promise<GetProductsResponse> {
  const { data } = await api.get<GetProductsResponse>(
    `/user/product?page=${page}&size=${size}`,
  )

  return data
}

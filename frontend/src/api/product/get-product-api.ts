import { api } from '@/lib/api'

export interface GetProductsBody {
  page: number
  size?: number | null
  sortBy?: string | null
  ascending?: boolean | null
  productId?: string | null
  name?: string | null
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
  ascending,
  sortBy,
  productId,
  name,
}: GetProductsBody): Promise<GetProductsResponse> {
  let API_URL = `/user/product?page=${page}&size=${size}`

  if (ascending !== undefined) {
    API_URL += `&ascending=${ascending}`
  }

  if (sortBy !== undefined) {
    API_URL += `&sortBy=${sortBy}`
  }

  if (productId) {
    API_URL += `&ids=[${productId}]`
  }

  if (name) {
    API_URL += `&name=${name}`
  }

  const { data } = await api.get<GetProductsResponse>(API_URL)

  return data
}

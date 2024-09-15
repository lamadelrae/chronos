import { api } from '@/lib/api'

export interface GetMostSoldProductsItem {
  id: string
  name: string
  quantity: number
  total: number
}

export async function getMostSoldProductsApi(): Promise<
  GetMostSoldProductsItem[]
> {
  const { data } = await api.get<GetMostSoldProductsItem[]>(
    `/user/product/top-sold`,
  )

  return data
}

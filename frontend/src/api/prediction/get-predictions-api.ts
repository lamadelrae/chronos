import { api } from '@/lib/api'

export interface GetProductPredictionItem {
  productId: string
  productName: string
  sales: Array<{
    date: string
    quantity: number
  }>
}

export async function getProductPredictionApi(): Promise<
  GetProductPredictionItem[]
> {
  const { data } =
    await api.get<GetProductPredictionItem[]>(`/user/predictions`)

  return data
}

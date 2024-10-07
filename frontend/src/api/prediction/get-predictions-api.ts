import { api } from '@/lib/api'

export interface GetProductPredictionItem {
  productId: string
  productName: string
  sales: Array<{
    date: string
    quantity: number
  }>
}

export async function getProductPredictionApi(
  productId?: string | null,
): Promise<GetProductPredictionItem[]> {
  let API_URL = '/user/predictions'

  if (productId) {
    API_URL += `?productId=${productId}`
  }

  const { data } = await api.get<GetProductPredictionItem[]>(API_URL)

  return data
}

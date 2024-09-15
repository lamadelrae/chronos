import type { GetProductPredictionItem } from '@/api/prediction/get-predictions-api'

export interface ProductWithPrediction {
  prediction: GetProductPredictionItem
  id: string
  name: string
  quantity: number
  total: number
}

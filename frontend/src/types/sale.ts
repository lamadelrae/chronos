export interface Sale {
  id: string
  date: string
  total: number
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
  }>
}

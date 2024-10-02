export interface Product {
  id: string
  name: string
  price: number
}

export interface TopSoldProduct extends Product {
  total: number
}

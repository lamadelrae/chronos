export interface Company {
  id: string
  companyName: string
  socialReason: string
  cnpj: string
  address: {
    address: string
    city: string
    state: string
    zipCode: string
  }
}

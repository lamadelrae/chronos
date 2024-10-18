import moment from 'moment'

export function formatDate(date: string | Date) {
  return moment(date).format('DD/MM/YYYY')
}

export function formatCurrency(amount: number) {
  return amount.toLocaleString('pt-BR', {
    currency: 'BRL',
    style: 'currency',
  })
}

export function formatUnit(amount: number) {
  return amount.toLocaleString()
}

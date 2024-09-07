export function formatDate(date: string | Date) {
  const dateObject = typeof date === 'string' ? new Date(date) : date

  return `${dateObject.getDate().toString().padStart(2, '0')}/${(dateObject.getMonth() + 1).toString().padStart(2, '0')}/${dateObject.getFullYear()}`
}

export function formatCurrency(amount: number) {
  return amount.toLocaleString('pt-BR', {
    currency: 'BRL',
    style: 'currency',
  })
}

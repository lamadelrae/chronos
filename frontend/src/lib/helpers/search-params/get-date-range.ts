import { format } from 'date-fns'
import type { ReadonlyURLSearchParams } from 'next/navigation'

const KEY_1 = 'start'
const KEY_2 = 'end'

export function getDateRange(searchParams: ReadonlyURLSearchParams) {
  try {
    const startParam = searchParams.get(KEY_1)
    const endParam = searchParams.get(KEY_2)

    const start = startParam
      ? format(new Date(parseInt(startParam)), 'yyyy-MM-dd')
      : undefined
    const end = endParam
      ? format(new Date(parseInt(endParam)), 'yyyy-MM-dd')
      : undefined

    return { start, end }
  } catch {
    return { start: undefined, end: undefined }
  }
}

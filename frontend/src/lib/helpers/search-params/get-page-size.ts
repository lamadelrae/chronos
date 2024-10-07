import type { ReadonlyURLSearchParams } from 'next/navigation'

const KEY = 'per_page'
const DEFAULT_VALUE = 10
const MAX_VALUE = 50
const MIN_VALUE = 10

export function getPageSize(searchParams: ReadonlyURLSearchParams): number {
  const param = searchParams.get(KEY)

  const pageSize = param ? parseInt(param) : DEFAULT_VALUE

  if (pageSize > MAX_VALUE) {
    return DEFAULT_VALUE
  }

  if (pageSize < MIN_VALUE) {
    return DEFAULT_VALUE
  }

  return pageSize
}

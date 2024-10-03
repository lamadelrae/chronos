import type { ReadonlyURLSearchParams } from 'next/navigation'

const KEY = 'sort'

export function getAscendingSort(
  searchParams: ReadonlyURLSearchParams,
): boolean {
  const sortParam = searchParams.get(KEY)

  return sortParam ? sortParam.includes('asc') : false
}

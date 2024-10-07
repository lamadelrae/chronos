import type { ReadonlyURLSearchParams } from 'next/navigation'

const KEY = 'sort'

export function getSortBy(
  searchParams: ReadonlyURLSearchParams,
): string | null {
  const sortParam = searchParams.get(KEY)

  if (!sortParam) {
    return null
  }

  const sorter = sortParam.split('.')[0]

  return sorter.charAt(0).toUpperCase() + sorter.slice(1)
}

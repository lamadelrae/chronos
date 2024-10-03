import type { ReadonlyURLSearchParams } from 'next/navigation'
import { z } from 'zod'

const KEY = 'page'

export function getPageIndex(searchParams: ReadonlyURLSearchParams): number {
  const pageIndex = z.coerce
    .number()
    .transform((p) => p - 1)
    .parse(searchParams.get(KEY) ?? '1')

  return pageIndex
}

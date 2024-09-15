'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from 'react-query'
import { z } from 'zod'

import { getSalesApi } from '@/api/sale/get-sales-api'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { Typography } from '@/components/ui/typography'

import { SalesTable } from './sales-table'

export default function SalesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const pageIndex = z.coerce
    .number()
    .transform((p) => p - 1)
    .parse(searchParams.get('page') ?? '1')

  const pageSize = z.coerce.number().parse(searchParams.get('pageSize') ?? '10')

  const { data: results, isLoading } = useQuery({
    queryKey: ['sales', pageIndex, pageSize],
    queryFn: () => getSalesApi({ page: pageIndex, size: pageSize }),
  })

  function handlePaginate(pageIndex: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', (pageIndex + 1).toString())
    router.push(`?${params.toString()}`)
  }

  const sales = results?.data ?? []

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h2" as="h1">
        Vendas
      </Typography>

      <div className="space-y-2.5">
        <div className="rounded-md border bg-white">
          <SalesTable isLoading={isLoading} sales={sales} />
        </div>

        {results && sales.length > 0 && (
          <DataTablePagination
            onPageChange={handlePaginate}
            pageIndex={results.currentPage}
            totalCount={results.totalItems}
            perPage={results.pageSize}
          />
        )}
      </div>
    </div>
  )
}

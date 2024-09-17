'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from 'react-query'
import { z } from 'zod'

import { getProductsApi } from '@/api/product/get-product-api'
import { DataTableFilters } from '@/components/data-table/data-table-filters'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { DataTablePaginationSkeleton } from '@/components/data-table/data-table-pagination-skeleton'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { ProductsTable } from './products-table'

export default function SalesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const pageIndex = z.coerce
    .number()
    .transform((p) => p - 1)
    .parse(searchParams.get('page') ?? '1')

  const sortBy = searchParams.get('sortBy') ?? 'CreatedAt'
  const ascending = searchParams.get('ascending') === 'true'

  const { data: results, isLoading } = useQuery({
    queryKey: ['products', pageIndex, sortBy, ascending],
    queryFn: () =>
      getProductsApi({
        page: pageIndex,
        sortBy,
        ascending,
      }),
  })

  function handlePaginate(pageIndex: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', (pageIndex + 1).toString())
    router.push(`?${params.toString()}`)
  }

  const products = results?.data ?? []

  return (
    <div>
      <DataTableFilters sortByOptions={['Name', 'Price', 'CreatedAt']} />
      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
          <CardDescription>
            Tenha uma visão detalhada dos seu produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductsTable isLoading={isLoading} products={products} />
        </CardContent>
        <CardFooter className="w-full">
          {isLoading ? (
            <DataTablePaginationSkeleton />
          ) : (
            results &&
            products.length > 0 && (
              <DataTablePagination
                onPageChange={handlePaginate}
                pageIndex={results.currentPage}
                totalCount={results.totalItems}
                perPage={results.pageSize}
              />
            )
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

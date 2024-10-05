'use client'

import { ArrowUp, LineChart, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useQuery } from 'react-query'

import { getSalesApi } from '@/api/sale/get-sales-api'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getAscendingSort } from '@/lib/helpers/search-params/get-ascending-sort'
import { getDateRange } from '@/lib/helpers/search-params/get-date-range'
import { getPageIndex } from '@/lib/helpers/search-params/get-page-index'
import { getPageSize } from '@/lib/helpers/search-params/get-page-size'
import { getSortBy } from '@/lib/helpers/search-params/get-sort-by'

import { SalesTable } from './table/sales-table'

export default function SalesPage() {
  const searchParams = useSearchParams()

  const pageIndex = getPageIndex(searchParams)
  const pageSize = getPageSize(searchParams)
  const ascending = getAscendingSort(searchParams)
  const sortBy = getSortBy(searchParams)
  const dateRange = getDateRange(searchParams)

  console.log(dateRange)

  const { data: results, isLoading: isSalesLoading } = useQuery({
    queryKey: ['sales', pageIndex, pageSize, sortBy, ascending, dateRange],
    queryFn: () =>
      getSalesApi({
        page: pageIndex,
        size: pageSize,
        sortBy,
        ascending,
        start: dateRange.start,
        end: dateRange.end,
      }),
  })

  const isLoading = isSalesLoading

  if (isLoading) {
    return <SalesPageSkeleton />
  }

  const sales = results?.data ?? []

  return (
    <div>
      <div className="grid flex-1 items-start gap-4 md:gap-6 lg:grid-cols-5 mb-6">
        <Card className="lg:col-span-4 h-full">
          <CardHeader className="pb-3">
            <CardTitle>Vendas</CardTitle>
            <CardDescription className="text-balance leading-relaxed">
              Visualize e gerencie suas vendas, acompanhe o desempenho e acesse
              detalhes importantes para otimizar seu negócio.
            </CardDescription>
          </CardHeader>
          <CardFooter className="mt-1.5 gap-2">
            <Button variant="outline" size="sm">
              <PlusCircle className="size-4 mr-2" />
              Nova
            </Button>
            <Button variant="outline" size="sm">
              <ArrowUp className="size-4 mr-2" />
              Importar
            </Button>
            <Link href="/analytics">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <LineChart className="size-4 mr-2" />
                Previsões
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardDescription>Vendas</CardDescription>
            <CardTitle className="text-4xl">{results?.totalItems}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Mostrando {results?.pageSize} por página.
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>

      <SalesTable sales={sales} pageCount={results?.pageCount ?? 0} />
    </div>
  )
}

function SalesPageSkeleton() {
  return (
    <div>
      <div className="grid flex-1 items-start gap-4 md:gap-6 lg:grid-cols-5 mb-6">
        <Card className="lg:col-span-4 h-full">
          <CardHeader className="pb-3">
            <Skeleton className="h-[27px] w-[160px]" />
            <Skeleton className="h-[27px] w-[60%]" />
          </CardHeader>
          <CardFooter className="mt-1.5 gap-2">
            <Skeleton className="h-[36px] w-[85px]" />
            <Skeleton className="h-[36px] w-[85px]" />
            <Skeleton className="h-[36px] w-[85px]" />
          </CardFooter>
        </Card>
        <Card className="h-full">
          <CardHeader className="pb-2">
            <Skeleton className="h-[22px] w-[132px]" />
            <Skeleton className="h-[41px] w-[83px]" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <Skeleton className="h-[15px] w-[140px]" />
            </div>
          </CardContent>
        </Card>
      </div>
      <DataTableSkeleton
        columnCount={6}
        cellWidths={['1rem', '8rem', '2rem', '2rem', '2rem', '2rem']}
        shrinkZero
      />
    </div>
  )
}

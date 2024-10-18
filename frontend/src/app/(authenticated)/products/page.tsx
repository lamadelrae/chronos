'use client'

import { ArrowUp, LineChart, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useQuery } from 'react-query'

import { getProductPredictionApi } from '@/api/prediction/get-predictions-api'
import { getProductsApi } from '@/api/product/get-product-api'
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
import { getPageIndex } from '@/lib/helpers/search-params/get-page-index'
import { getPageSize } from '@/lib/helpers/search-params/get-page-size'
import { getSortBy } from '@/lib/helpers/search-params/get-sort-by'

import { ProductsTable } from './table/products-table'

export default function SalesPage() {
  const searchParams = useSearchParams()

  const pageIndex = getPageIndex(searchParams)
  const pageSize = getPageSize(searchParams)
  const ascending = getAscendingSort(searchParams)
  const sortBy = getSortBy(searchParams)
  const productName = searchParams.get('name')

  const { data: results, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products', pageIndex, pageSize, sortBy, ascending, productName],
    queryFn: () =>
      getProductsApi({
        page: pageIndex,
        size: pageSize,
        sortBy,
        ascending,
        name: productName,
      }),
  })

  const { data: productPredictions, isLoading: isPredictionsLoading } =
    useQuery({
      queryFn: () => getProductPredictionApi(),
      queryKey: ['product-predictions'],
    })

  const isLoading = isProductsLoading || isPredictionsLoading

  if (isLoading) {
    return <ProductsPageSkeleton />
  }

  const predictions = productPredictions ?? []
  const products = results?.data ?? []

  const predictionIds = predictions.map((pred) => pred.productId)

  return (
    <div>
      <div className="grid flex-1 items-start gap-4 md:gap-6 lg:grid-cols-5 mb-6">
        <Card className="lg:col-span-4 h-full">
          <CardHeader className="pb-3">
            <CardTitle>Produtos</CardTitle>
            <CardDescription className="text-balance leading-relaxed">
              Gerencie o catálogo de produtos e acesse previsões de vendas para
              otimizar seu estoque.
            </CardDescription>
          </CardHeader>
          <CardFooter className="mt-1.5 gap-2">
            <Button variant="outline" size="sm" disabled>
              <PlusCircle className="size-4 mr-2" />
              Novo
            </Button>
            <Button variant="outline" size="sm" disabled>
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
            <CardDescription>Produtos</CardDescription>
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

      <ProductsTable
        products={products}
        pageCount={results?.pageCount ?? 0}
        predictionIds={predictionIds}
      />
    </div>
  )
}

function ProductsPageSkeleton() {
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
        columnCount={5}
        searchableColumnCount={1}
        cellWidths={['2.5rem', '6rem', '20rem', '4rem', '2rem']}
        shrinkZero
      />
    </div>
  )
}

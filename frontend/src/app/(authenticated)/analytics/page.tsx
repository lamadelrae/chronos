'use client'

import { ArrowUpRight, Package, PackageX } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { getProductPredictionApi } from '@/api/prediction/get-predictions-api'
import { getMostSoldProductsApi } from '@/api/product/get-most-sold-products-api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Typography } from '@/components/ui/typography'
import { formatUnit } from '@/lib/formatters'
import type { ProductWithPrediction } from '@/types/prediction'

const calculatePrediction = (product: ProductWithPrediction, days: number) => {
  return product.prediction.sales
    .slice(0, days)
    .reduce((sum, sale) => sum + sale.quantity, 0)
}

export default function AnalyticsPage() {
  const { data: mostSoldProducts, isLoading: isMostSoldProductsLoading } =
    useQuery({
      queryFn: getMostSoldProductsApi,
      queryKey: ['most-sold-products'],
    })

  const { data: productPredictions, isLoading: isPredictionsLoading } =
    useQuery({
      queryFn: () => getProductPredictionApi(),
      queryKey: ['product-predictions'],
    })

  const products = mostSoldProducts ?? []
  const predictions = productPredictions ?? []

  const productsWithPredictions = products
    .map((product) => {
      const productPrediction = predictions.find(
        (pred) => pred.productId === product.id,
      )

      if (!productPrediction) {
        return null
      }

      return {
        ...product,
        prediction: productPrediction,
      }
    })
    .filter((product) => product?.id) as ProductWithPrediction[]

  const isLoading = isMostSoldProductsLoading || isPredictionsLoading

  const { totalPredictions, productsWithCalculatedPredictions } =
    useMemo(() => {
      const totalPredictions = {
        threeDays: 0,
        fiveDays: 0,
        tenDays: 0,
      }

      const productsWithCalculatedPredictions = productsWithPredictions.map(
        (product) => {
          const calculatedPredictions = {
            threeDays: calculatePrediction(product, 3),
            fiveDays: calculatePrediction(product, 5),
            tenDays: calculatePrediction(product, 10),
          }

          totalPredictions.threeDays += calculatedPredictions.threeDays
          totalPredictions.fiveDays += calculatedPredictions.fiveDays
          totalPredictions.tenDays += calculatedPredictions.tenDays

          return {
            ...product,
            calculatedPredictions,
          }
        },
      )

      return { totalPredictions, productsWithCalculatedPredictions }
    }, [productsWithPredictions])

  if (isLoading) {
    return <AnalyticsPageSkeleton />
  }

  if (!productPredictions || productPredictions.length === 0) {
    return <AnalyticsEmptyState />
  }

  return (
    <div>
      <div className="lg:grid lg:grid-cols-4 lg:gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Produtos</CardDescription>
            <CardTitle className="text-4xl">
              {productsWithPredictions.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Com previsão de vendas realizada.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Nos próximos 3 dias</CardDescription>
            <CardTitle className="text-4xl">
              {formatUnit(Math.round(totalPredictions.threeDays))}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Vendas serão realizadas.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Nos próximos 5 dias</CardDescription>
            <CardTitle className="text-4xl">
              {formatUnit(Math.round(totalPredictions.fiveDays))}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Vendas serão realizadas.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Nos próximos 10 dias</CardDescription>
            <CardTitle className="text-4xl">
              {formatUnit(Math.round(totalPredictions.tenDays))}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Vendas serão realizadas.
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="w-[140px] text-right">
                Vendas 3 dias
              </TableHead>
              <TableHead className="w-[140px] text-right">
                Vendas 5 dias
              </TableHead>
              <TableHead className="w-[140px] text-right">
                Vendas 10 dias
              </TableHead>
              <TableHead className="w-[160px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsWithCalculatedPredictions.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-mono text-xs font-medium">
                  {product.id}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="font-medium text-right">
                  {formatUnit(
                    Math.round(product.calculatedPredictions.threeDays),
                  )}
                </TableCell>
                <TableCell className="font-medium text-right">
                  {formatUnit(
                    Math.round(product.calculatedPredictions.fiveDays),
                  )}
                </TableCell>
                <TableCell className="font-medium text-right">
                  {formatUnit(
                    Math.round(product.calculatedPredictions.tenDays),
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="xs" asChild>
                    <Link href={`/analytics/${product.id}`}>
                      <ArrowUpRight className="h-4 w-4 mr-1.5" />
                      Detalhes
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function AnalyticsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70svh]">
      <PackageX className="h-16 w-16 text-muted-foreground mb-4" />
      <Typography variant="h4" className="mb-2">
        Nenhum dado disponível
      </Typography>
      <Typography className="text-muted-foreground mb-6">
        Não há dados de análise para exibir no momento.
      </Typography>
      <div className="flex items-center gap-2">
        <Button variant="accent">Nova predição</Button>
        <Button variant="outline">
          <Package className="size-4 mr-1.5" /> Produtos
        </Button>
      </div>
    </div>
  )
}

function AnalyticsPageSkeleton() {
  return (
    <div>
      <div className="lg:grid lg:grid-cols-4 lg:gap-6 mb-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardDescription>
                <Skeleton className="h-[22px] w-[132px]" />
              </CardDescription>
              <CardTitle className="text-4xl">
                <Skeleton className="h-[41px] w-[83px]" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <Skeleton className="h-[15px] w-[140px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Skeleton className="h-4 w-8" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="w-[140px] text-right">
                <Skeleton className="h-4 w-24 ml-auto" />
              </TableHead>
              <TableHead className="w-[140px] text-right">
                <Skeleton className="h-4 w-24 ml-auto" />
              </TableHead>
              <TableHead className="w-[140px] text-right">
                <Skeleton className="h-4 w-24 ml-auto" />
              </TableHead>
              <TableHead className="w-[160px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(20)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-xs font-medium">
                  <Skeleton className="h-4 w-64" />
                </TableCell>
                <TableCell className="font-medium">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="font-medium text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </TableCell>
                <TableCell className="font-medium text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </TableCell>
                <TableCell className="font-medium text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-24 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

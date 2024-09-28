import { ArrowUpRight, PackageX } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from 'react-query'
import { Line, LineChart } from 'recharts'

import { getProductPredictionApi } from '@/api/prediction/get-predictions-api'
import { getMostSoldProductsApi } from '@/api/product/get-most-sold-products-api'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import { formatCurrency, formatUnit } from '@/lib/formatters'
import type { ProductWithPrediction } from '@/types/prediction'

export function PredictionChartCard() {
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
    .filter((product) => product?.id)
    .slice(0, 10) as ProductWithPrediction[]

  const isLoading = isMostSoldProductsLoading || isPredictionsLoading
  const isEmpty = productsWithPredictions.length === 0

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Melhores produtos</CardTitle>
          <CardDescription>
            Os produtos com maior número de vendas desde a abertura da loja.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1" variant="accent">
          <Link href="/sales">
            <ArrowUpRight className="h-4 w-4" />
            Ver tudo
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[360px]">
          {isEmpty && !isLoading ? (
            <PredictionChartardEmptyState />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-40">Previsão</TableHead>
                  <TableHead className="w-40 text-right">Qtd.</TableHead>
                  <TableHead className="w-40 text-right">Valor Total</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 10 }).map((_, index) => (
                      <PredictionChartCardRowSkeleton key={index} />
                    ))
                  : productsWithPredictions.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Avatar>
                            <AvatarFallback>
                              {product.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <PredicitonChart
                            chartData={product.prediction.sales}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {formatUnit(product.quantity)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(product.total)}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="xs" asChild>
                            <Link href="/">
                              <ArrowUpRight className="h-4 w-4 mr-1.5" />
                              Detalhes
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export function PredictionChartCardRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-10 w-10 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[200px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[40px] w-full" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-[80px] ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-[80px] ml-auto" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-[100px]" />
      </TableCell>
    </TableRow>
  )
}

interface PredicitonChartProps {
  chartData: Array<{
    date: string
    quantity: number
  }>
}

const chartConfig = {
  quantity: {
    label: 'Quantidade',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig

export function PredicitonChart({ chartData }: PredicitonChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[40px] w-full">
      <LineChart data={chartData}>
        <Line
          dataKey="quantity"
          type="natural"
          stroke="var(--color-quantity)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

function PredictionChartardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center pt-10">
      <PackageX className="h-12 w-12 text-muted-foreground mb-2" />
      <Typography variant="h5" className="mb-1">
        Nenhuma venda recente
      </Typography>
      <Typography variant="small">
        Quando você realizar vendas, elas aparecerão aqui.
      </Typography>
    </div>
  )
}

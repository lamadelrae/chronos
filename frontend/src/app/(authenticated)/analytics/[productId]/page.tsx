'use client'

import { Copy, Download, RefreshCcw } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { toast } from 'sonner'

import { getProductPredictionApi } from '@/api/prediction/get-predictions-api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatUnit } from '@/lib/formatters'

const chartConfig = {
  quantity: {
    label: 'Previsão de vendas',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export default function ProductAnalyticsPage() {
  const { productId } = useParams()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data: productPrediction, isLoading: isPredictionLoading } = useQuery({
    queryFn: () => getProductPredictionApi(productId as string),
    queryKey: ['product-prediction', productId],
  })

  const product = productPrediction?.[0]

  if (isPredictionLoading) {
    return <ProductAnalyticsPageSkeleton />
  }

  if (!product) {
    return <div>error</div>
  }

  const predictions = product.sales
  const totalSales = predictions.reduce((sum, pre) => sum + pre.quantity, 0)
  const averageSales = totalSales / predictions.length

  async function handleCopyProductId() {
    if (!product) return

    try {
      await navigator.clipboard.writeText(product.productId)

      toast.success('Copiado!')
    } catch {
      toast.error('Erro copiando, tente novamente')
    }
  }

  const handleExtractData = () => {
    const csvContent = [
      ['Data', 'Quantidade'],
      ...product.sales.map((sale) => [formatDate(sale.date), sale.quantity]),
    ]
      .map((e) => e.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute(
        'download',
        `${product.productName.toLowerCase().replaceAll(' ', '_')}_vendas.csv`,
      )
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      location.reload()
    }, 5000)
  }

  return (
    <div>
      <div className="block items-start gap-4 lg:grid lg:grid-cols-3">
        <div className="col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardTitle>Previsões de venda</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  Previsões de venda para auxiliar no planejamento de estoque e
                  estratégias comerciais. Previsões possuem uma margem de erro
                  de até 20%.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCcw
                    className={`size-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                  {isRefreshing ? 'Recalculando...' : 'Re-calcular'}
                </Button>
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription>Total de Vendas</CardDescription>
                <CardTitle className="text-4xl">
                  {formatUnit(totalSales)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Total previsto para o período
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-05-chunk-2">
              <CardHeader className="pb-2">
                <CardDescription>Média Diária</CardDescription>
                <CardTitle className="text-4xl">
                  {formatUnit(averageSales)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Média de vendas por dia
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-4">
            <CardHeader className="px-7">
              <CardDescription>Com base no seu histórico,</CardDescription>
              <CardTitle>Os próximos 10 dias de vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="h-[400px] w-full lg:col-span-6"
              >
                <AreaChart
                  accessibilityLayer={true}
                  data={predictions}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />

                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => formatDate(value)}
                  />

                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />

                  <Area
                    dataKey="quantity"
                    type="natural"
                    fill="hsl(var(--chart-1))"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={0.4}
                    dot={false}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 lg:mt-0 h-full">
          <Card className="overflow-hidden h-full flex flex-col">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  {product.productName}
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={handleCopyProductId}
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copiar ID do produto</span>
                  </Button>
                </CardTitle>
                <CardDescription className="text-xs">
                  ID: {product.productId}
                </CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1"
                  onClick={handleExtractData}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                    Extrair
                  </span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm flex-1">
              <div className="flex flex-col gap-3 h-full justify-between">
                <div>
                  <div className="font-semibold mb-2">Vendas</div>

                  <ul className="grid gap-3">
                    {product.sales.map((sale) => (
                      <li
                        key={sale.date}
                        className="flex items-center justify-between"
                      >
                        <span className="text-muted-foreground">
                          {formatDate(sale.date)}
                        </span>
                        <span>{formatUnit(sale.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator className="my-2" />

                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pior dia</span>
                    <span>
                      {formatUnit(
                        Math.min(...product.sales.map((sale) => sale.quantity)),
                      )}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Melhor dia</span>
                    <span>
                      {formatUnit(
                        Math.max(...product.sales.map((sale) => sale.quantity)),
                      )}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Média</span>
                    <span>
                      {formatUnit(
                        product.sales.reduce(
                          (sum, sale) => sum + sale.quantity,
                          0,
                        ) / product.sales.length,
                      )}
                    </span>
                  </li>
                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span>
                      {formatUnit(
                        product.sales.reduce(
                          (sum, sale) => sum + sale.quantity,
                          0,
                        ),
                      )}
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Última atualização{' '}
                <time dateTime={product.sales[product.sales.length - 1].date}>
                  {formatDate(product.sales[product.sales.length - 1].date)}
                </time>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ProductAnalyticsPageSkeleton() {
  return (
    <div>
      <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 h-full">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-5/6 mt-1" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-9 w-28" />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="px-7">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[400px] w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="h-full">
          <Card className="overflow-hidden h-full flex flex-col">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-1" />
              </div>
              <div className="ml-auto">
                <Skeleton className="h-8 w-20" />
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm flex-1">
              <Skeleton className="h-full w-full" />
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <Skeleton className="h-4 w-1/2" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

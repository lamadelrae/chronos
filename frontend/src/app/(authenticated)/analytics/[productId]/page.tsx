'use client'

import {
  Copy,
  CreditCard,
  Download,
  MoreVertical,
  RefreshCcw,
  Truck,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { useQuery } from 'react-query'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import { getProductPredictionApi } from '@/api/prediction/get-predictions-api'
import { Badge } from '@/components/ui/badge'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatUnit } from '@/lib/formatters'

const chartConfig = {
  quantity: {
    label: 'Previsão de vendas',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export default function ProductAnalyticsPage() {
  const { productId } = useParams()

  const { data: productPrediction, isLoading: isPredictionLoading } = useQuery({
    queryFn: () => getProductPredictionApi(productId as string),
    queryKey: ['product-prediction', productId],
  })

  const product = productPrediction?.[0]

  if (isPredictionLoading) {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>error</div>
  }

  console.log(product)

  const predictions = product.sales
  const totalSales = predictions.reduce((sum, pre) => sum + pre.quantity, 0)
  const totalDays = predictions.length

  return (
    <div>
      <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 h-full">
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
                <Button variant="outline" size="sm">
                  <RefreshCcw className="size-4 mr-2" />
                  Re-calcular
                </Button>
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription>This Week</CardDescription>
                <CardTitle className="text-4xl">$1,329</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  +25% from last week
                </div>
              </CardContent>
              <CardFooter>
                {/* <Progress value={25} aria-label="25% increase" /> */}
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-2">
              <CardHeader className="pb-2">
                <CardDescription>This Month</CardDescription>
                <CardTitle className="text-4xl">$5,329</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  +10% from last month
                </div>
              </CardContent>
              <CardFooter>
                {/* <Progress value={12} aria-label="12% increase" /> */}
              </CardFooter>
            </Card>
          </div>
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardDescription>
                Com base no seu histórico de vendas,
              </CardDescription>
              <CardTitle>Seus próximos 10 dias de vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="h-[400px] w-full lg:col-span-6"
              >
                <LineChart accessibilityLayer={true} data={predictions}>
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

                  <Line
                    dataKey="quantity"
                    type="natural"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <div className="h-full">
          <Card className="overflow-hidden h-full flex flex-col">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  {product.productName}
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
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
                <Button size="sm" variant="outline" className="h-8 gap-1">
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

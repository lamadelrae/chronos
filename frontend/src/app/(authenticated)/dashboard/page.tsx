'use client'
import { ArrowUpRight, DollarSign, Package2, Receipt } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from 'react-query'

import { getUserMetrics } from '@/api/metrics/get-user-metrics'
import { MetricsChartCard } from '@/components/app/cards/metrics-chart-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { correctMetricsByDay } from '@/lib/helpers/metrics/correct-metrics-by-day'

export default function Dashboard() {
  const {
    data: metrics,
    error: metricsError,
    isLoading: isMetricsLoading,
  } = useQuery({
    queryFn: getUserMetrics,
    queryKey: ['user-metrics'],
  })

  if (isMetricsLoading) return null
  if (!metrics) return null

  const correctedMetrics = correctMetricsByDay(metrics)

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="grid gap-4 grid-cols-2 md:gap-8 lg:grid-cols-4">
        <MetricsChartCard
          id="MMR"
          type="currency"
          title="Faturamento"
          icon={DollarSign}
          value={correctedMetrics.current.total}
          change={
            ((correctedMetrics.current.total - correctedMetrics.last.total) /
              correctedMetrics.last.total) *
            100
          }
          dataKey={'total'}
          valueLabel="Faturamento"
          chartData={correctedMetrics.current.days}
          lastMonthData={correctedMetrics.last.days}
        />

        <MetricsChartCard
          id="sales"
          type="unit"
          title="Vendas"
          icon={Package2}
          value={correctedMetrics.current.saleQuantity}
          change={
            ((correctedMetrics.current.saleQuantity -
              correctedMetrics.last.saleQuantity) /
              correctedMetrics.last.saleQuantity) *
            100
          }
          dataKey={'saleQuantity'}
          valueLabel="Vendas"
          chartData={correctedMetrics.current.days}
          lastMonthData={correctedMetrics.last.days}
        />

        <MetricsChartCard
          id="average-ticket"
          type="currency"
          title="Ticket Médio"
          icon={Receipt}
          value={correctedMetrics.current.averageTicket}
          change={
            ((correctedMetrics.current.averageTicket -
              correctedMetrics.last.averageTicket) /
              correctedMetrics.last.averageTicket) *
            100
          }
          dataKey={'averageTicket'}
          valueLabel="Ticket Médio"
          chartData={correctedMetrics.current.days}
          lastMonthData={correctedMetrics.last.days}
        />

        <MetricsChartCard
          id="pmv"
          type="currency"
          title="Preço Médio de Venda"
          icon={Package2}
          value={correctedMetrics.current.averageSellingPrice}
          change={
            ((correctedMetrics.current.averageSellingPrice -
              correctedMetrics.last.averageSellingPrice) /
              correctedMetrics.last.averageSellingPrice) *
            100
          }
          dataKey={'averageSellingPrice'}
          valueLabel="Preço Médio de Venda"
          chartData={correctedMetrics.current.days}
          lastMonthData={correctedMetrics.last.days}
        />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Vendas</CardTitle>
              <CardDescription>
                Últimas vendas feitas pela sua empresa.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="#">
                Ver todas
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="hidden xl:table-column">Type</TableHead>
                  <TableHead className="hidden xl:table-column">
                    Status
                  </TableHead>
                  <TableHead className="hidden xl:table-column">Date</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Liam Johnson</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      liam@exemplo.com
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">Sale</TableCell>
                  <TableCell className="hidden xl:table-column">
                    <Badge className="text-xs" variant="outline">
                      Approved
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                    2023-06-23
                  </TableCell>
                  <TableCell className="text-right">R$250,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Olivia Smith</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      olivia@exemplo.com
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    Refund
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    <Badge className="text-xs" variant="outline">
                      Declined
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                    2023-06-24
                  </TableCell>
                  <TableCell className="text-right">R$150,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Noah Williams</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      noah@exemplo.com
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    Subscription
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    <Badge className="text-xs" variant="outline">
                      Approved
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                    2023-06-25
                  </TableCell>
                  <TableCell className="text-right">R$350,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Emma Brown</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      emma@exemplo.com
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">Sale</TableCell>
                  <TableCell className="hidden xl:table-column">
                    <Badge className="text-xs" variant="outline">
                      Approved
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                    2023-06-26
                  </TableCell>
                  <TableCell className="text-right">R$450,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Liam Johnson</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      liam@exemplo.com
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">Sale</TableCell>
                  <TableCell className="hidden xl:table-column">
                    <Badge className="text-xs" variant="outline">
                      Approved
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                    2023-06-27
                  </TableCell>
                  <TableCell className="text-right">R$550,00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>
              Os produtos que mais venderam no mês.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>CP</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Computador</p>
                <p className="text-sm text-muted-foreground">Intel I5 8700K</p>
              </div>
              <div className="ml-auto font-medium">+R$199,00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>CP</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Computador</p>
                <p className="text-sm text-muted-foreground">Intel I5 8700K</p>
              </div>
              <div className="ml-auto font-medium">+R$199,00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>CP</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Computador</p>
                <p className="text-sm text-muted-foreground">Intel I5 8700K</p>
              </div>
              <div className="ml-auto font-medium">+R$199,00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>CP</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Computador</p>
                <p className="text-sm text-muted-foreground">Intel I5 8700K</p>
              </div>
              <div className="ml-auto font-medium">+R$199,00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>CP</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Computador</p>
                <p className="text-sm text-muted-foreground">Intel I5 8700K</p>
              </div>
              <div className="ml-auto font-medium">+R$199,00</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

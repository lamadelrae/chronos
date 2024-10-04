'use client'

import { Calendar, DollarSign, Package2, Receipt, Store } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from 'react-query'

import { getUserMetrics } from '@/api/metrics/get-user-metrics'
import { Button } from '@/components/ui/button'
import MonthPicker from '@/components/ui/month-picker'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { correctMetricsByDay } from '@/lib/helpers/metrics/correct-metrics-by-day'

import { LastSalesCard } from './last-sales-card'
import { MetricsChartCard } from './metrics-chart-card'
import { PredictionChartCard } from './predition-chart-card'

export default function Dashboard() {
  const [date, setDate] = useState(new Date())
  const month = date.getMonth()

  const { data: metrics, isLoading: isMetricsLoading } = useQuery({
    queryFn: () => getUserMetrics({ date }),
    queryKey: ['metrics', `month-${month}`],
  })

  if (isMetricsLoading) {
    return <DashboardSkeleton />
  }

  if (!metrics) return null

  const correctedMetrics = correctMetricsByDay(metrics)

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="xs"
            className="fixed bottom-8 right-8 w-12 h-12 flex items-center justify-center rounded-full z-10"
          >
            <Calendar />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-fit" align="end">
          <MonthPicker currentMonth={date} onMonthChange={setDate} />
        </PopoverContent>
      </Popover>

      <div className="grid gap-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
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
          icon={Store}
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

      <div className="flex flex-col md:grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-4 md:mt-8">
        <PredictionChartCard />
        <LastSalesCard />
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div>
      <div className="grid gap-4 grid-cols-2 md:gap-8 lg:grid-cols-4 mt-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-[200px] w-full" />
        ))}
      </div>

      <div className="flex md:grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-4 md:mt-8">
        <Skeleton className="h-[500px] w-full col-span-2" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    </div>
  )
}

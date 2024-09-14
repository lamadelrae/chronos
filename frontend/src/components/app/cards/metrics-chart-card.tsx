import type { LucideIcon } from 'lucide-react'
import React from 'react'
import { Area, AreaChart, XAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formatCurrency, formatDate, formatUnit } from '@/lib/formatters'

interface MetricsChartCardProps {
  id: string
  type: 'currency' | 'unit'
  title: string
  icon: LucideIcon
  value: number
  change: number
  chartData: Record<string, unknown>[]
  lastMonthData: Record<string, unknown>[]
  dataKey: string
  valueLabel: string
}

export function MetricsChartCard({
  id,
  type,
  title,
  icon: Icon,
  value,
  change,
  chartData,
  lastMonthData,
  dataKey,
  valueLabel,
}: MetricsChartCardProps) {
  const isPositive = change > 0

  return (
    <Card className="w-full" x-chunk="charts-01-chunk-7">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="p-0">
        <div className="text-2xl font-bold px-6">
          {type === 'currency' ? formatCurrency(value) : formatUnit(value)}
        </div>

        <p
          className="text-xs text-muted-foreground px-6 text-rose-500 data-[positive='true']:text-emerald-600"
          data-positive={isPositive}
        >
          {change.toFixed(2)}% em comparação com mês anterior
        </p>

        <ChartContainer
          className="h-[140px] w-full"
          config={{
            [dataKey]: {
              label: valueLabel,
              color: `hsl(var(--chart-${isPositive ? '2' : '1'}))`,
            },
            [`${dataKey}LastMonth`]: {
              label: `${valueLabel} (Mês Anterior)`,
              color: 'hsl(var(--chart-3))',
            },
          }}
        >
          <AreaChart
            accessibilityLayer
            data={chartData.map((item, index) => ({
              ...item,
              [`${dataKey}LastMonth`]: lastMonthData[index]?.[dataKey],
            }))}
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="date" hide />

            <defs>
              <linearGradient
                id={`fill-${dataKey}-${id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={`hsl(var(--chart-${isPositive ? '2' : '1'}))`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`hsl(var(--chart-${isPositive ? '2' : '1'}))`}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id={`fill-${dataKey}-${id}-last-month`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <Area
              dataKey={dataKey}
              type="natural"
              fill={`url(#fill-${dataKey}-${id})`}
              fillOpacity={0.4}
              stroke={`hsl(var(--chart-${isPositive ? '2' : '1'}))`}
            />

            <Area
              dataKey={`${dataKey}LastMonth`}
              type="natural"
              fill={`url(#fill-${dataKey}-${id}-last-month)`}
              fillOpacity={0.2}
              stroke="hsl(var(--chart-3))"
              strokeDasharray="4 4"
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(date: string) => formatDate(date)}
                />
              }
              formatter={(value: number, name: string) => (
                <div className="flex min-w-[200px] items-center text-xs text-muted-foreground">
                  {name === `${dataKey}LastMonth` ? 'Mês Anterior' : valueLabel}

                  <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                    {type === 'currency'
                      ? formatCurrency(value)
                      : formatUnit(value)}
                  </div>
                </div>
              )}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

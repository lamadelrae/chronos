import { GetUserMetricsResponse } from '@/api/metrics/get-user-metrics'

export function correctMetricsByDay(
  metrics: GetUserMetricsResponse,
): GetUserMetricsResponse {
  const currentMonthDays = metrics.current.days.length
  const lastMonthDays = metrics.last.days.slice(0, currentMonthDays)

  const recalculatedLastMonth = lastMonthDays.reduce(
    (acc, day) => {
      acc.total += day.total
      acc.saleQuantity += day.saleQuantity
      return acc
    },
    { total: 0, saleQuantity: 0 },
  )

  return {
    ...metrics,
    last: {
      ...metrics.last,
      days: lastMonthDays,
      total: recalculatedLastMonth.total,
      saleQuantity: recalculatedLastMonth.saleQuantity,
    },
  }
}

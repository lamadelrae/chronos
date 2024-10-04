import {
  add,
  eachMonthOfInterval,
  endOfYear,
  format,
  isEqual,
  isFuture,
  parse,
  startOfMonth,
  startOfToday,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function getStartOfCurrentMonth() {
  return startOfMonth(startOfToday())
}

interface MonthPickerProps {
  currentMonth: Date
  onMonthChange: (newMonth: Date) => void
}

export default function MonthPicker({
  currentMonth,
  onMonthChange,
}: MonthPickerProps) {
  const [currentYear, setCurrentYear] = React.useState(
    format(currentMonth, 'yyyy'),
  )
  const firstDayCurrentYear = parse(currentYear, 'yyyy', new Date())

  const months = eachMonthOfInterval({
    start: firstDayCurrentYear,
    end: endOfYear(firstDayCurrentYear),
  })

  function previousYear() {
    const firstDayNextYear = add(firstDayCurrentYear, { years: -1 })
    setCurrentYear(format(firstDayNextYear, 'yyyy'))
  }

  function nextYear() {
    const firstDayNextYear = add(firstDayCurrentYear, { years: 1 })
    setCurrentYear(format(firstDayNextYear, 'yyyy'))
  }

  return (
    <div className="p-3">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="space-y-4">
          <div className="relative flex items-center justify-center pt-1">
            <div
              className="text-sm font-medium"
              aria-live="polite"
              role="presentation"
              id="month-picker"
            >
              {format(firstDayCurrentYear, 'yyyy')}
            </div>
            <div className="flex items-center space-x-1">
              <button
                name="previous-year"
                aria-label="Go to previous year"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  'absolute left-1',
                )}
                type="button"
                onClick={previousYear}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                name="next-year"
                aria-label="Go to next year"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  'absolute right-1 disabled:bg-slate-100',
                )}
                type="button"
                disabled={isFuture(add(firstDayCurrentYear, { years: 1 }))}
                onClick={nextYear}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div
            className="grid w-full grid-cols-3 gap-2"
            role="grid"
            aria-labelledby="month-picker"
          >
            {months.map((month) => (
              <div
                key={month.toString()}
                className="relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md dark:[&:has([aria-selected])]:bg-slate-800"
                role="presentation"
              >
                <button
                  name="day"
                  className={cn(
                    'inline-flex h-9 w-16 items-center justify-center rounded-md p-0 text-sm font-normal ring-offset-white transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-selected:opacity-100 dark:ring-offset-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus-visible:ring-slate-800',
                    isEqual(month, currentMonth) &&
                      'bg-slate-900 text-slate-50 hover:bg-slate-900 hover:text-slate-50 focus:bg-slate-900 focus:text-slate-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50 dark:hover:text-slate-900 dark:focus:bg-slate-50 dark:focus:text-slate-900',
                    !isEqual(month, currentMonth) &&
                      isEqual(month, getStartOfCurrentMonth()) &&
                      'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50',
                  )}
                  disabled={isFuture(month)}
                  role="gridcell"
                  tabIndex={-1}
                  type="button"
                  onClick={() => onMonthChange(month)}
                >
                  <time dateTime={format(month, 'yyyy-MM-dd')}>
                    {format(month, 'MMM', { locale: ptBR })}
                  </time>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

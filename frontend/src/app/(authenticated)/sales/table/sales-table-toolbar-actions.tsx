'use client'

/* eslint-disable react-hooks/exhaustive-deps */
import { DownloadIcon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range'
import { exportTableToCSV } from '@/lib/export'
import type { Sale } from '@/types/sale'

interface SalesTableToolbarActionsProps {
  table: Table<Sale>
}

export function SalesTableToolbarActions({
  table,
}: SalesTableToolbarActionsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  // Start and end date
  const [date, setDate] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })

  useEffect(() => {
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    if (start && end) {
      const newDate = {
        from: new Date(parseInt(start)),
        to: new Date(parseInt(end)),
      }

      handleDateChange(newDate)
    }
  }, [])

  const handleDateChange = (newDate: DateRange | undefined) => {
    if (!newDate) return

    const now = new Date()

    let from = newDate?.from ?? new Date()
    let to = newDate?.to ?? new Date()

    if (from.getTime() > now.getTime()) from = now
    if (to.getTime() > now.getTime()) to = now

    params.set('start', `${from.getTime()}`)
    params.set('end', `${to.getTime()}`)

    router.push(`?${params.toString()}`)

    setDate({ from, to })
  }

  return (
    <div className="flex items-center gap-2">
      <DatePickerWithRange date={date} setDate={handleDateChange} />

      <Button
        variant="secondary"
        size="xs"
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'sales',
            excludeColumns: ['select', 'actions', 'pmv', 'items'],
          })
        }
      >
        <DownloadIcon className="mr-1.5 size-4" aria-hidden="true" />
        Exportar
      </Button>
    </div>
  )
}

/* eslint-disable react-hooks/exhaustive-deps */

import { format, subDays } from 'date-fns'
import { ArrowDown, ArrowUp, Check, ChevronDown, Filter } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Toggle } from '@/components/ui/toggle'

const SORT_BY_LABELS = {
  Date: 'Data',
  Total: 'Total',
  Name: 'Nome',
  Price: 'Preço',
  CreatedAt: 'Data de criação',
} as const

type SortByOption = keyof typeof SORT_BY_LABELS

interface DataTableFiltersProps {
  sortByOptions: SortByOption[]
}

// Default filter values in case of a fresh load
const FROM = subDays(new Date(), 30)
const TO = new Date()

interface FixedDateRange {
  from: Date
  to: Date
}

export function DataTableFilters({ sortByOptions }: DataTableFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Start and end date
  const [date, setDate] = useState<FixedDateRange>({ from: FROM, to: TO })

  // Filters
  const [sortBy, setSortBy] = useState<string>(sortByOptions[0])
  const [ascending, setAscending] = useState(true)
  const [isFilterChanged, setIsFilterChanged] = useState(false)

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams)

    params.set('start', format(date.from, 'yyyy-MM-dd'))
    params.set('end', format(date.to, 'yyyy-MM-dd'))
    params.set('sortBy', sortBy)
    params.set('ascending', ascending.toString())

    router.push(`?${params.toString()}`)

    setIsFilterChanged(false)
  }, [date, sortBy, ascending, searchParams, router])

  useEffect(() => {
    const start = searchParams.get('start')
    const end = searchParams.get('end')
    const sortByParam = searchParams.get('sortBy')
    const ascendingParam = searchParams.get('ascending')

    const newDate = {
      from: start ? new Date(start) : date.from,
      to: end ? new Date(end) : date.to,
    }

    setDate(newDate)
    setSortBy(sortByParam || 'Date')
    setAscending(ascendingParam === 'true')
  }, [])

  const handleDateChange = (newDate: DateRange | undefined) => {
    if (!newDate) return

    const now = new Date()

    let from = newDate?.from ?? new Date()
    let to = newDate?.to ?? new Date()

    if (from.getTime() > now.getTime()) from = now
    if (to.getTime() > now.getTime()) to = now

    setDate({ from, to })
    setIsFilterChanged(true)
  }

  const handleSortByChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    setIsFilterChanged(true)
  }

  const handleAscendingChange = (newAscending: boolean) => {
    setAscending(newAscending)
    setIsFilterChanged(true)
  }

  return (
    <div className="flex items-center space-x-3 justify-end mb-4">
      {isFilterChanged && (
        <Button size="xs" onClick={updateFilters} variant="ghost">
          <Check className="w-4 h-4 mr-1.5" />
          Salvar
        </Button>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button size="xs" variant="secondary">
            <Filter className="w-4 h-4 mr-1.5" />
            Filtros
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit" align="end">
          <div className="flex items-center space-x-4 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-between">
                  Ordenar por: {SORT_BY_LABELS[sortBy as SortByOption]}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Ordernar</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {sortByOptions.map((item) => (
                  <DropdownMenuCheckboxItem
                    key={item}
                    checked={sortBy === item}
                    onCheckedChange={() => handleSortByChange(item)}
                  >
                    {SORT_BY_LABELS[item]}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center space-x-2">
              <Toggle
                id="ascending"
                pressed={ascending}
                onPressedChange={handleAscendingChange}
                className="h-10 w-10 p-0"
                variant="outline"
              >
                {ascending ? (
                  <ArrowUp className="size-5" />
                ) : (
                  <ArrowDown className="size-5" />
                )}
              </Toggle>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <DatePickerWithRange date={date} setDate={handleDateChange} />
    </div>
  )
}

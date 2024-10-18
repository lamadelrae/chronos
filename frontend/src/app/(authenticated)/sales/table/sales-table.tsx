'use client'
'use memo'

import * as React from 'react'

import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/use-data-table'
import type { Sale } from '@/types/sale'

import { getColumns } from './sales-table-columns'
import { SalesTableToolbarActions } from './sales-table-toolbar-actions'

interface SalesTableProps {
  sales: Sale[]
  pageCount: number
}

export function SalesTable({ sales, pageCount }: SalesTableProps) {
  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), [])

  const { table } = useDataTable({
    data: sales,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: 'date', desc: true }],
    },
  })

  return (
    <DataTable table={table} className="mb-20">
      <DataTableToolbar table={table}>
        <SalesTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

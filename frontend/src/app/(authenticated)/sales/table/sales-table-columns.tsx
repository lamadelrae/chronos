'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import * as React from 'react'
import { useState } from 'react'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { formatCurrency, formatUnit } from '@/lib/formatters'
import type { Sale } from '@/types/sale'

import { SalesTableDialog } from './sales-table-details-dialog'

export function getColumns(): ColumnDef<Sale>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="mt-1.5"
          role="checkbox"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="mt-1.5 w-4"
        />
      ),
      size: 0,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <div className="font-mono text-xs w-[300px]">{row.getValue('id')}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('date'))
        return (
          <div className="w-[200px]">
            {formatDistanceToNow(date, { addSuffix: true, locale: ptBR })}
          </div>
        )
      },
    },
    {
      accessorKey: 'items',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Items" />
      ),
      cell: ({ row }) => {
        const cell = row.original

        const totalItems = cell.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        )

        return <Badge variant="outline">{formatUnit(totalItems)}</Badge>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'pmv',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="PMV" />
      ),
      cell: ({ row }) => {
        const cell = row.original

        const totalItems = cell.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        )
        const averageSellingPrice = cell.total / totalItems

        return formatCurrency(averageSellingPrice)
      },
      enableSorting: false,
    },
    {
      accessorKey: 'total',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
      cell: ({ row }) => formatCurrency(row.getValue('total')),
    },
    {
      accessorKey: 'actions',
      header: undefined,
      cell: ({ row }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [isOpen, setIsOpen] = useState(false)

        return (
          <div className="w-[40px]">
            <SalesTableDialog
              open={isOpen}
              onOpen={setIsOpen}
              sale={row.original}
            />
          </div>
        )
      },
    },
  ]
}

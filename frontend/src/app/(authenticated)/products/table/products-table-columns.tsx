'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpRight, X } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { formatCurrency } from '@/lib/formatters'
import type { Product } from '@/types/product'

export interface GetColumnsProps {
  predictionIds: string[]
}

export function getColumns({
  predictionIds,
}: GetColumnsProps): ColumnDef<Product>[] {
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
      size: 20,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="mt-1.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <div className="font-mono text-xs w-[240px]">{row.getValue('id')}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Produto" />
      ),
      cell: ({ row }) => row.getValue('name'),
      size: 9999,
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Preço Unitário" />
      ),
      cell: ({ row }) => (
        <div className="w-[120px]">{formatCurrency(row.getValue('price'))}</div>
      ),
    },
    {
      accessorKey: 'actions',
      header: undefined,
      size: 135,
      cell: ({ row }) => {
        const productId = row.getValue('id') as string
        const hasPrediction = predictionIds.includes(productId)

        if (!hasPrediction) {
          return (
            <div className="w-[140px]">
              <Button disabled variant="outline" size="xs">
                <X className="size-4 mr-1.5" />
                Sem previsão
              </Button>
            </div>
          )
        }

        return (
          <div className="w-[140px]">
            <Button asChild variant="outline" size="xs">
              <Link href={`/analytics/${productId}`}>
                <ArrowUpRight className="size-4 mr-1.5" />
                Previsão
              </Link>
            </Button>
          </div>
        )
      },
    },
  ]
}

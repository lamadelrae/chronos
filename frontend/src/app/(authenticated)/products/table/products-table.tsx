/* eslint-disable react-hooks/exhaustive-deps */

'use client'
'use memo'

import * as React from 'react'

import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/use-data-table'
import { type DataTableFilterField } from '@/types'
import type { Product } from '@/types/product'

import { getColumns } from './products-table-columns'
import { ProductsTableToolbarActions } from './products-table-toolbar-actions'

interface ProductsTableProps {
  products: Product[]
  pageCount: number
  predictionIds: string[]
}

export function ProductsTable({
  products,
  pageCount,
  predictionIds,
}: ProductsTableProps) {
  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(
    () => getColumns({ predictionIds }),
    [predictionIds, products],
  )

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<Product>[] = [
    {
      label: 'Nome',
      value: 'name',
      placeholder: 'Nome do produto...',
    },
  ]

  const { table } = useDataTable({
    data: products,
    columns,
    pageCount,
    filterFields,
  })

  return (
    <DataTable table={table} className="mb-20">
      <DataTableToolbar table={table} filterFields={filterFields}>
        <ProductsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

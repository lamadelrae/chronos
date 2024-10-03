'use client'

import { DownloadIcon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { exportTableToCSV } from '@/lib/export'
import type { Product } from '@/types/product'

interface ProductsTableToolbarActionsProps {
  table: Table<Product>
}

export function ProductsTableToolbarActions({
  table,
}: ProductsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="xs"
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'products',
            excludeColumns: ['select', 'actions'],
          })
        }
      >
        <DownloadIcon className="mr-1.5 size-4" aria-hidden="true" />
        Exportar
      </Button>
    </div>
  )
}

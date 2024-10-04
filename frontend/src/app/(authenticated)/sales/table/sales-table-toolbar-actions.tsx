'use client'

import { DownloadIcon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { exportTableToCSV } from '@/lib/export'
import type { Sale } from '@/types/sale'

interface SalesTableToolbarActionsProps {
  table: Table<Sale>
}

export function SalesTableToolbarActions({
  table,
}: SalesTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
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

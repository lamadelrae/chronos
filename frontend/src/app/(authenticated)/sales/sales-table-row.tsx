import 'moment/locale/pt-br'

import moment from 'moment'
import { useState } from 'react'

import { GetSalesResponse } from '@/api/sale/get-sales-api'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/formatters'

import { SalesTableDialog } from './sales-table-details-dialog'

interface SalesTableRowProps {
  sale: GetSalesResponse['data'][0]
}

export function SalesTableRow({ sale }: SalesTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  moment.locale('pt-br')

  return (
    <TableRow key={sale.id}>
      <TableCell>
        <SalesTableDialog
          onOpen={setIsDetailsOpen}
          open={isDetailsOpen}
          sale={sale}
        />
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">{sale.id}</TableCell>
      <TableCell className="text-muted-foreground">
        {moment(sale.date).fromNow()}
      </TableCell>
      <TableCell className="font-medium">
        {formatCurrency(sale.total)}
      </TableCell>
    </TableRow>
  )
}

import { GetSalesResponse } from '@/api/sale/get-sales-api'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { SalesTableRow } from './sales-table-row'
import { SalesTableSkeleton } from './sales-table-skeleton'

export function SalesTable({
  sales,
  isLoading,
}: {
  isLoading: boolean
  sales: GetSalesResponse['data']
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[64px]"></TableHead>
          <TableHead className="w-[300px]">ID</TableHead>
          <TableHead>Data</TableHead>
          <TableHead className="w-[140px]">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!isLoading ? (
          sales.map((sale) => <SalesTableRow key={sale.id} sale={sale} />)
        ) : (
          <SalesTableSkeleton />
        )}
      </TableBody>
    </Table>
  )
}

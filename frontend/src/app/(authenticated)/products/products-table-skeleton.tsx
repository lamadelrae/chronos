import { Search } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function ProductsTableSkeleton() {
  return Array.from({ length: 10 }).map((_, index) => {
    return (
      <TableRow key={index}>
        <TableCell className="font-mono text-xs font-medium">
          <Skeleton className="h-[20px] w-[300px]" />
        </TableCell>
        <TableCell className="font-medium">
          <Skeleton className="h-[20px] w-full" />
        </TableCell>
        <TableCell className="font-medium">
          <Skeleton className="h-[20px] w-[140px]" />
        </TableCell>
      </TableRow>
    )
  })
}

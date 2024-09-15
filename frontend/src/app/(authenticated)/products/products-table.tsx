import type { GetProductsResponse } from '@/api/product/get-product-api'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ProductsTableRow } from './products-table-row'
import { ProductsTableSkeleton } from './products-table-skeleton'

export function ProductsTable({
  products,
  isLoading,
}: {
  isLoading: boolean
  products: GetProductsResponse['data']
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">ID</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead className="w-[140px]">Preço</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!isLoading ? (
          products.map((product) => (
            <ProductsTableRow key={product.id} product={product} />
          ))
        ) : (
          <ProductsTableSkeleton />
        )}
      </TableBody>
    </Table>
  )
}

import { GetProductsResponse } from '@/api/product/get-product-api'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/formatters'

interface ProductsTableRowProps {
  product: GetProductsResponse['data'][0]
}

export function ProductsTableRow({ product }: ProductsTableRowProps) {
  return (
    <TableRow key={product.id}>
      <TableCell className="font-mono text-xs font-medium">
        {product.id}
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell className="font-medium">
        {formatCurrency(product.price)}
      </TableCell>
    </TableRow>
  )
}

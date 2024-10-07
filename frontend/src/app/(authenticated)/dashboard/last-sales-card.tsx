import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { DollarSign, PackageX } from 'lucide-react'
import { useQuery } from 'react-query'

import { getSalesApi } from '@/api/sale/get-sales-api'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Typography } from '@/components/ui/typography'
import { formatCurrency } from '@/lib/formatters'

export function LastSalesCard() {
  const { data: mostRecentSales, isLoading: isMostRecentSalesLoading } =
    useQuery({
      queryFn: () =>
        getSalesApi({
          ascending: false,
          sortBy: 'Date',
          page: 0,
          size: 6,
        }),
      queryKey: ['most-recent-sales'],
    })

  const sales = mostRecentSales?.data ?? []

  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Últimas vendas</CardTitle>
        <CardDescription>
          Visualize as vendas mais recentes realizadas na sua loja.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[360px]">
          <div className="grid gap-6">
            {isMostRecentSalesLoading ? (
              <LastSalesCardSkeleton />
            ) : sales.length === 0 ? (
              <LastSalesCardEmptyState />
            ) : (
              sales.map((sale) => (
                <div className="flex items-center gap-4" key={sale.id}>
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarFallback>
                      <DollarSign
                        aria-hidden
                        className="text-muted-foreground size-4"
                      />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {sale.items.length ?? 0}
                      {sale.items.length === 1 ? ' item' : ' itens'}
                    </p>
                    <p className="text-sm text-muted-foreground leading-none">
                      {format(new Date(sale.date), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-accent">
                    +{formatCurrency(sale.total)}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function LastSalesCardSkeleton() {
  return [...Array(6)].map((_, index) => (
    <div className="flex items-center gap-4" key={index}>
      <Avatar className="hidden h-9 w-9 sm:flex">
        <AvatarFallback>
          <DollarSign aria-hidden className="text-muted-foreground size-4" />
        </AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <Skeleton className="h-[16px] mb-2.5 w-20 text-sm leading-none" />
        <Skeleton className="h-[16px] w-32 text-sm leading-none" />
      </div>
      <Skeleton className="h-4 w-16 ml-auto" />
    </div>
  ))
}

function LastSalesCardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center pt-10">
      <PackageX className="h-12 w-12 text-muted-foreground mb-2" />
      <Typography variant="h5" className="mb-1">
        Nenhuma venda recente
      </Typography>
      <Typography variant="small">
        Quando você realizar vendas, elas aparecerão aqui.
      </Typography>
    </div>
  )
}

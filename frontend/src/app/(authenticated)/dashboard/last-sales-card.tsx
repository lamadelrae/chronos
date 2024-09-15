import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function LastSalesCard() {
  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Produtos</CardTitle>
        <CardDescription>Os produtos que mais venderam no mês.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>CP</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Computador</p>
            <p className="text-sm text-muted-foreground">Intel I5 8700K</p>
          </div>
          <div className="ml-auto font-medium">+R$199,00</div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>CP</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Computador</p>
            <p className="text-sm text-muted-foreground">Intel I5 8700K</p>
          </div>
          <div className="ml-auto font-medium">+R$199,00</div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>CP</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Computador</p>
            <p className="text-sm text-muted-foreground">Intel I5 8700K</p>
          </div>
          <div className="ml-auto font-medium">+R$199,00</div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>CP</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Computador</p>
            <p className="text-sm text-muted-foreground">Intel I5 8700K</p>
          </div>
          <div className="ml-auto font-medium">+R$199,00</div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>CP</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Computador</p>
            <p className="text-sm text-muted-foreground">Intel I5 8700K</p>
          </div>
          <div className="ml-auto font-medium">+R$199,00</div>
        </div>
      </CardContent>
    </Card>
  )
}

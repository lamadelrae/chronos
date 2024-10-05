import { PanelLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { ChronosLogo } from '@/components/icons/chronos-logo'
import { SearchCommand } from '@/components/search-command'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { APP_NAVIGATION } from '@/constants/app-navigation'
import { MY_ACCOUNT_NAVIGATION } from '@/constants/my-account-navigation'
import { useAuth } from '@/hooks/use-auth'

import { SmartBreadcrumbs } from './smart-breadcrumbs'

export function AppHeader() {
  const { signOut } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 md:static md:h-auto md:border-0 md:bg-transparent md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="md:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="md:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <ChronosLogo className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Chronos</span>
            </Link>
            {APP_NAVIGATION.map((navigationItem) => (
              <Link
                key={navigationItem.name}
                href={navigationItem.path}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <navigationItem.icon className="h-5 w-5" />
                {navigationItem.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <SmartBreadcrumbs />

      <SearchCommand />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Image
              src="https://images.pexels.com/photos/12898975/pexels-photo-12898975.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {MY_ACCOUNT_NAVIGATION.map((link) => (
            <DropdownMenuItem
              asChild
              className="cursor-pointer"
              key={link.name}
            >
              <Link href={link.path}>{link.name}</Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="cursor-pointer">
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

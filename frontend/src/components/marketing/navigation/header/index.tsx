'use client'

// Icons
import { MenuIcon, XIcon } from 'lucide-react'

import { ChronosLogo } from '@/components/icons/chronos-logo'
import { Button } from '@/components/ui/button'
// shadcn
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { MARKETING_NAVIGATION } from '@/constants/marketing-navigation'

export function MarketingHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Chronos</span>
            <ChronosLogo size={24} withCopy className="text-foreground" />
          </a>
        </div>

        {/* Mob drawer */}
        <div className="flex lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
              >
                <span className="sr-only">Open main menu</span>
                <MenuIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Chronos</span>
                  <ChronosLogo size={20} className="text-foreground" />
                </a>
                <SheetClose asChild>
                  <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-foreground/70"
                  >
                    <span className="sr-only">Close menu</span>
                    <XIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
                </SheetClose>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-foreground/10">
                  <div className="space-y-2 py-6">
                    {MARKETING_NAVIGATION.map((item) => (
                      <a
                        key={item.name}
                        href={item.path}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-foreground/10"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    <a
                      href="#"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-foreground hover:bg-foreground/10"
                    >
                      Log in
                    </a>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desk navigation */}
        <div className="hidden lg:flex lg:gap-x-12">
          {MARKETING_NAVIGATION.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className="text-sm font-semibold leading-6 text-foreground"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desk log-in button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button size="xs">Login</Button>
        </div>
      </nav>
    </header>
  )
}

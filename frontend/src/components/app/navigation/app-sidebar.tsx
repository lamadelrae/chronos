import { Settings } from 'lucide-react'
import Link from 'next/link'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { APP_NAVIGATION } from '@/constants/app-navigation'

import { ChronosLogo } from '../../icons/chronos-logo'

export function AppSidebar() {
  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background md:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <ChronosLogo className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Chronos</span>
          </Link>
          {APP_NAVIGATION.map((navigationItem, index) => (
            <Tooltip key={navigationItem.name}>
              <TooltipTrigger
                className='data-[hidden="true"]:hidden'
                data-hidden={index === APP_NAVIGATION.length - 1}
                asChild
              >
                <Link
                  href={navigationItem.path}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <navigationItem.icon className="h-5 w-5" />
                  <span className="sr-only">{navigationItem.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                {navigationItem.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  )
}

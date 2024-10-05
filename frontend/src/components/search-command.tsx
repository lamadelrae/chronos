'use client'

import { CreditCard, Search, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { APP_NAVIGATION } from '@/constants/app-navigation'

export function SearchCommand() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <div
        className="relative sm:ml-auto flex-1 md:grow-0 flex w-full items-center justify-center"
        role="button"
        onClick={() => setOpen(true)}
      >
        <div className="text-sm text-muted-foreground inline-flex items-center gap-4 border rounded-md px-4 py-2">
          <div className="inline-flex items-center gap-1.5">
            <Search className="size-4" />
            <span>Buscar...</span>
          </div>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>L
          </kbd>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Páginas">
            {APP_NAVIGATION.map((item) => (
              <CommandItem
                className="cursor-pointer"
                key={item.name}
                onSelect={() => {
                  router.push(item.path)
                  setOpen(false)
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator className="mb-1" />

          <CommandGroup heading="Configurações">
            <CommandItem
              className="cursor-pointer"
              onSelect={() => {
                router.push('/settings')
                setOpen(false)
              }}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Sua conta</span>
            </CommandItem>

            <CommandItem
              className="cursor-pointer"
              onSelect={() => {
                router.push('/settings')
                setOpen(false)
              }}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Pagamentos</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

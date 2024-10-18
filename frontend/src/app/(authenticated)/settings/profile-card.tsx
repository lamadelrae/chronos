import { zodResolver } from '@hookform/resolvers/zod'
import { Edit } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'sonner'
import { z } from 'zod'

import { editUserApi } from '@/api/user/edit-user-api'
import { getUserApi } from '@/api/user/get-user-api'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Typography } from '@/components/ui/typography'
import { updateUserCache } from '@/lib/cache-manipulation'
import type { User } from '@/types/user'

export function SettingsProfileCard() {
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getUserApi,
  })

  if (isUserLoading) {
    return <SettingsProfileCardSkeleton />
  }

  return (
    <div className="border rounded-lg p-4 flex justify-between items-start bg-white/50">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback>
            {user?.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <Typography variant="h5">{user?.name}</Typography>
          <Typography className="text-sm">{user?.email}</Typography>
        </div>
      </div>

      <EditProfileDialog />
    </div>
  )
}

function SettingsProfileCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-start bg-white/50">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
    </div>
  )
}

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email().min(1, 'E-mail é obrigatório'),
})

export function EditProfileDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUserApi,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  const { mutateAsync: edit, isLoading: isEditing } = useMutation({
    mutationFn: editUserApi,
    mutationKey: ['edit-user'],
    onMutate({ name, email }) {
      const { cached } = updateUserCache({
        queryClient,
        user: { ...(user as User), name, email },
      })

      form.reset({
        name,
        email,
      })

      return { previous: cached }
    },
    onError(_, __, context) {
      if (context?.previous) {
        updateUserCache({ queryClient, user: context.previous })
      }
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const userToEdit = {
        ...(user as User),
        name: values.name,
        email: values.email,
      }

      setIsOpen(false)

      await edit(userToEdit)

      toast.success('Perfil atualizado com sucesso.')
    } catch {
      toast.error('Não foi possível atualizar seu perfil, tente novamente.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-1.5" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando
            terminar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isEditing}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="name" className="text-right">
                      Nome
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        id="name"
                        placeholder="Seu nome"
                        {...field}
                        autoComplete="name"
                        aria-describedby="name-description"
                      />
                    </FormControl>
                  </div>
                  <FormDescription id="name-description" className="sr-only">
                    Digite seu nome completo
                  </FormDescription>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <FormField
              disabled={isEditing}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="name" className="text-right">
                      E-mail
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        id="email"
                        placeholder="Seu e-mail"
                        {...field}
                        autoComplete="email"
                        aria-describedby="email-description"
                      />
                    </FormControl>
                  </div>
                  <FormDescription id="email-description" className="sr-only">
                    Digite seu nome completo
                  </FormDescription>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isEditing}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" variant="accent" disabled={isEditing}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

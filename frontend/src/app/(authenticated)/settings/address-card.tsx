import { zodResolver } from '@hookform/resolvers/zod'
import { Edit } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'sonner'
import { z } from 'zod'

import { editCompanyApi } from '@/api/company/edit-company.api'
import { getCompanyApi } from '@/api/company/get-company-api'
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
import { updateCompaniesCache } from '@/lib/cache-manipulation'
import type { Company } from '@/types/company'

export function SettingsAddressCard() {
  const { data: company, isLoading: isCompanyLoading } = useQuery({
    queryKey: ['company'],
    queryFn: getCompanyApi,
  })

  if (isCompanyLoading) {
    return <AddressCardSkeleton />
  }

  return (
    <div className="border rounded-md p-4 bg-white/50">
      <div className="flex items-start justify-between mb-4">
        <Typography variant="h4">Endereço</Typography>
        <EditAddressDialog />
      </div>

      <div className="grid grid-cols-2 gap-y-4">
        <div>
          <dt>
            <Typography className="font-semibold text-foreground">
              Rua
            </Typography>
          </dt>
          <dd>
            <Typography className="mt-2">
              {company?.address?.address}
            </Typography>
          </dd>
        </div>
        <div>
          <dt>
            <Typography className="font-semibold text-foreground">
              Cidade
            </Typography>
          </dt>
          <dd>
            <Typography className="mt-2">{company?.address?.city}</Typography>
          </dd>
        </div>
        <div>
          <dt>
            <Typography className="font-semibold text-foreground">
              Estado
            </Typography>
          </dt>
          <dd>
            <Typography className="mt-2">{company?.address?.state}</Typography>
          </dd>
        </div>
        <div>
          <dt>
            <Typography className="font-semibold text-foreground">
              CEP
            </Typography>
          </dt>
          <dd>
            <Typography className="mt-2">
              {company?.address?.zipCode}
            </Typography>
          </dd>
        </div>
      </div>
    </div>
  )
}

function AddressCardSkeleton() {
  return (
    <div className="border rounded-md p-4 bg-white/50">
      <div className="flex items-start justify-between mb-4">
        <div className="h-[28px] w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-[40px] w-24 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-y-4">
        {[...Array(4)].map((_, index) => (
          <div key={index}>
            <dt>
              <div className="h-[25px] w-20 bg-gray-200 rounded animate-pulse" />
            </dt>
            <dd>
              <div className="h-[25px] w-32 bg-gray-200 rounded animate-pulse mt-2" />
            </dd>
          </div>
        ))}
      </div>
    </div>
  )
}

const formSchema = z.object({
  address: z.string({ message: 'Rua é obrigatória' }).min(1, 'Obrigatório'),
  state: z.string({ message: 'Estado é obrigatório' }).min(1, 'Obrigatório'),
  city: z.string({ message: 'Cidade é obrigatória' }).min(1, 'Obrigatório'),
  zipCode: z.string({ message: 'CEP é obrigatório' }).min(1, 'Obrigatório'),
})

export function EditAddressDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data: company } = useQuery({
    queryKey: ['company'],
    queryFn: getCompanyApi,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: company?.address?.address || '',
      state: company?.address?.state || '',
      city: company?.address?.city || '',
      zipCode: company?.address?.zipCode || '',
    },
  })

  const { mutateAsync: edit, isLoading: isEditing } = useMutation({
    mutationFn: editCompanyApi,
    mutationKey: ['edit-company'],
    onMutate({ address }) {
      const { cached } = updateCompaniesCache({
        queryClient,
        company: { ...(company as Company), address },
      })

      form.reset({
        address: address.address,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      })

      return { previous: cached }
    },
    onError(_, __, context) {
      if (context?.previous) {
        updateCompaniesCache({ queryClient, company: context.previous })
      }
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const companyToEdit: Company = {
        ...(company as Company),
        address: { ...values },
      }

      setIsOpen(false)

      await edit(companyToEdit)

      toast.success('Endereço atualizado.')
    } catch {
      toast.error('Não foi possível atualizar seu endereço, tente novamente.')
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
          <DialogTitle>Editar endereço</DialogTitle>
          <DialogDescription>
            Faça alterações no seu endereço aqui. Clique em salvar quando
            terminar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isEditing}
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="address" className="text-right">
                      Rua
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        id="address"
                        placeholder="Digite a rua"
                        {...field}
                        autoComplete="street-address"
                        aria-describedby="address-description"
                      />
                    </FormControl>
                  </div>
                  <FormDescription id="address-description" className="sr-only">
                    Digite o nome da rua, número e complemento se houver
                  </FormDescription>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />
            <FormField
              disabled={isEditing}
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="state" className="text-right">
                      Estado
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        id="state"
                        placeholder="Digite o estado"
                        {...field}
                        autoComplete="address-level1"
                        aria-describedby="state-description"
                      />
                    </FormControl>
                  </div>
                  <FormDescription id="state-description" className="sr-only">
                    Digite o nome do estado ou a sigla
                  </FormDescription>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />
            <FormField
              disabled={isEditing}
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="city" className="text-right">
                      Cidade
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        id="city"
                        placeholder="Digite a cidade"
                        {...field}
                        autoComplete="address-level2"
                        aria-describedby="city-description"
                      />
                    </FormControl>
                  </div>
                  <FormDescription id="city-description" className="sr-only">
                    Digite o nome da cidade
                  </FormDescription>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />
            <FormField
              disabled={isEditing}
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="zipCode" className="text-right">
                      CEP
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        id="zipCode"
                        placeholder="Digite o CEP"
                        {...field}
                        autoComplete="postal-code"
                        aria-describedby="zipCode-description"
                      />
                    </FormControl>
                  </div>
                  <FormDescription id="zipCode-description" className="sr-only">
                    Digite o CEP no formato 00000-000
                  </FormDescription>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isEditing}>
                  Voltar
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

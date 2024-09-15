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

export function SettingsCompanyCard() {
  const { data: company, isLoading: isCompanyLoading } = useQuery({
    queryKey: ['company'],
    queryFn: getCompanyApi,
  })

  if (isCompanyLoading) {
    return <CompanyCardSkeleton />
  }

  return (
    <div className="border rounded-md p-4 bg-white/50">
      <div className="flex items-start justify-between mb-4">
        <Typography variant="h4">Empresa</Typography>
        <EditCompanyDialog />
      </div>

      <div className="grid grid-cols-2 gap-y-4">
        <div>
          <dt>
            <Typography className="font-semibold text-foreground">
              Nome
            </Typography>
          </dt>
          <dd>
            <Typography className="mt-2">{company?.companyName}</Typography>
          </dd>
        </div>
        <div>
          <dt>
            <Typography className="font-semibold text-foreground">
              Razão Social
            </Typography>
          </dt>
          <dd>
            <Typography className="mt-2">{company?.socialReason}</Typography>
          </dd>
        </div>
        <div>
          <dt>
            <Typography className="font-semibold text-foreground">
              CNPJ
            </Typography>
          </dt>
          <dd>
            <Typography className="mt-2">{company?.cnpj}</Typography>
          </dd>
        </div>
      </div>
    </div>
  )
}

function CompanyCardSkeleton() {
  return (
    <div className="border rounded-md p-4 bg-white/50">
      <div className="flex items-start justify-between mb-4">
        <div className="h-[28px] w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-[40px] w-24 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-y-4">
        {[...Array(3)].map((_, index) => (
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
  companyName: z.string().min(1, 'Nome da empresa é obrigatório'),
  socialReason: z.string().min(1, 'Razão social é obrigatória'),
})

export function EditCompanyDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data: company } = useQuery({
    queryKey: ['company'],
    queryFn: getCompanyApi,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: company?.companyName || '',
      socialReason: company?.socialReason || '',
    },
  })

  const { mutateAsync: edit, isLoading: isEditing } = useMutation({
    mutationFn: editCompanyApi,
    mutationKey: ['edit-company'],
    onMutate({ socialReason, companyName }) {
      const { cached } = updateCompaniesCache({
        queryClient,
        company: { ...(company as Company), socialReason, companyName },
      })

      form.reset({
        companyName,
        socialReason,
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
      const companyToEdit = {
        ...(company as Company),
        ...values,
      }

      setIsOpen(false)

      await edit(companyToEdit)

      toast.success('Dados da empresa atualizados.')
    } catch {
      toast.error(
        'Não foi possível atualizar os dados da empresa, tente novamente.',
      )
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
          <DialogTitle>Editar dados da empresa</DialogTitle>
          <DialogDescription>
            Faça alterações nos dados da sua empresa aqui. Clique em salvar
            quando terminar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isEditing}
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="companyName" className="text-right">
                      Nome
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        id="companyName"
                        placeholder="Nome da Empresa"
                        {...field}
                        autoComplete="name"
                        aria-describedby="companyName-description"
                      />
                    </FormControl>
                  </div>
                  <FormDescription
                    id="companyName-description"
                    className="sr-only"
                  >
                    Digite o nome da empresa
                  </FormDescription>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <FormField
              disabled={isEditing}
              control={form.control}
              name="socialReason"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel
                      htmlFor="socialReason"
                      className="text-right whitespace-pre"
                    >
                      Razão Social
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        id="socialReason"
                        placeholder="Razão Social"
                        {...field}
                        autoComplete="name"
                        aria-describedby="socialReason-description"
                      />
                    </FormControl>
                  </div>
                  <FormDescription
                    id="socialReason-description"
                    className="sr-only"
                  >
                    Digite a razão social da empresa
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

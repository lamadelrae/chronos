'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import LoginIllustration from '@/assets/login-illustration.svg'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'

const formSchema = z.object({
  email: z.string({ message: 'Obrigatório' }).email('E-mail inválido'),
  password: z.string({ message: 'Obrigatório' }).min(1, 'Mínimo de 1 caracter'),
})

export default function SignInPage() {
  const { signIn } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit({ email, password }: z.infer<typeof formSchema>) {
    try {
      await signIn({ email, password })
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data)
      }
    }
  }

  return (
    <div className="w-full grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 bg-white">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Bem-vindo</h1>
            <p className="text-balance text-muted-foreground">
              Faça log-in ou crie sua conta
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="usuario@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input placeholder="*******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-8 w-full" variant="accent">
                Entrar
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            Ainda não é usuário?{' '}
            <Link href="#" className="underline">
              Se cadastre aqui.
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-background lg:flex items-center justify-center select-none">
        <Image src={LoginIllustration} alt="Image" width="500" height="435" />
      </div>
    </div>
  )
}

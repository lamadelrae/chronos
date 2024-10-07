'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
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
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('E-mail inválido'),
  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(1, 'Mínimo de 1 caracter'),
})

type FormValues = z.infer<typeof formSchema>

export default function SignInPage() {
  const { signIn, isAuthenticating } = useAuth()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      await signIn(values)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data || 'Ocorreu um erro ao fazer login')
      } else {
        toast.error('Ocorreu um erro inesperado')
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
              Faça login ou crie sua conta
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="usuario@email.com"
                        autoComplete="email"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Senha</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="*******"
                        autoComplete="current-password"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                variant="accent"
                disabled={isAuthenticating}
              >
                {isAuthenticating ? (
                  <Loader2 className="animate-spin text-white" />
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            Ainda não é usuário?{' '}
            <Link href="/sign-up" className="underline">
              Se cadastre aqui.
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-background lg:flex items-center justify-center select-none">
        <Image
          src={LoginIllustration}
          alt="Ilustração de login"
          width={500}
          height={435}
        />
      </div>
    </div>
  )
}

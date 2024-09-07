import Image from 'next/image'
import Link from 'next/link'

import LoginIllustration from '@/assets/login-illustration.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignInPage() {
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
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login com Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
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

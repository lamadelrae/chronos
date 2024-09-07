import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function MarketingFooterNewsletter() {
  return (
    <div className="bg-foreground py-16 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:col-span-7">
          <h2 className="inline sm:block lg:inline xl:block">
            Quer receber novidades e atualizações?
          </h2>{' '}
          <p className="inline sm:block lg:inline xl:block">
            Inscreva-se em nossa newsletter.
          </p>
        </div>

        <form className="w-full max-w-md lg:col-span-5 lg:pt-2">
          <div className="flex gap-x-4">
            <label htmlFor="email-address" className="sr-only">
              Endereço de e-mail
            </label>

            <Input
              id="email-address"
              name="email"
              type="email"
              required
              placeholder="Digite seu e-mail"
              autoComplete="email"
              className="border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10"
            />

            <Button variant="accent">Inscrever-se</Button>
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-300">
            Seu dados estarão seguros, nós nos preocupamos com eles. <br />
            Leia nossa{' '}
            <a href="#" className="font-semibold text-white">
              política de privacidade
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  )
}

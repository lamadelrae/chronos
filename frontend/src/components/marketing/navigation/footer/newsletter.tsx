import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Typography } from '@/components/ui/typography'

export function MarketingFooterNewsletter() {
  return (
    <div className="bg-foreground/90 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:col-span-7">
          <Typography
            variant="h2"
            className="text-background text-center sm:text-left"
          >
            Quer saber de novidades e atualizações?
          </Typography>
          <Typography
            variant="h3"
            className="text-background mt-4 text-center sm:text-left"
          >
            Assine nossa newsletter.
          </Typography>
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
              className="border-0 bg-background/5 px-3.5 py-2 text-background/50 shadow-sm ring-1 ring-inset ring-foreground/5"
            />

            <Button variant="accent">Inscrever-se</Button>
          </div>
          <Typography className="mt-4 text-sm text-background/60 text-center sm:text-left">
            Saiba como dados estarão seguros com nossa{' '}
            <a href="#" className="font-semibold text-background/90">
              política de privacidade
            </a>
            .
          </Typography>
        </form>
      </div>
    </div>
  )
}

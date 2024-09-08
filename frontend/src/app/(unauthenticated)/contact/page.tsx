import Link from 'next/link'

import { Typography } from '@/components/ui/typography'
import { CONTACT_OPTIONS } from '@/constants/contact-options'
import { LOCATION_OPTIONS } from '@/constants/location-options'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
      <div className="mx-auto max-w-2xl space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
          <div>
            <Typography as="h1" variant="h2">
              Fale conosco
            </Typography>
            <Typography className="mt-6">
              Entre em contato com nossa equipe para obter suporte, informações
              sobre carreiras, colaborações ou contatos com a imprensa.
            </Typography>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
            {CONTACT_OPTIONS.map((option) => (
              <div key={option.name} className="rounded-2xl bg-white p-10">
                <Typography className="font-semibold text-foreground">
                  {option.role}
                </Typography>
                <dl className="mt-3 space-y-1">
                  <div>
                    <dt className="sr-only">Nome</dt>
                    <dd>
                      <Typography className="text-sm">{option.name}</Typography>
                    </dd>
                  </div>
                  <div>
                    <dt className="sr-only">Email</dt>
                    <dd>
                      <Link href={`mailto:${option.email}`}>
                        <Typography className="text-sm text-accent font-semibold">
                          {option.email}
                        </Typography>
                      </Link>
                    </dd>
                  </div>
                  <div className="mt-1">
                    <dt className="sr-only">Telefone</dt>
                    <Typography className="text-sm">{option.phone}</Typography>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 pt-16 lg:grid-cols-3">
          <div>
            <Typography variant="h2">Localizações</Typography>
            <Typography className="mt-6">
              Nossos escritórios estão estrategicamente localizados para melhor
              atender nossos clientes.
            </Typography>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
            {LOCATION_OPTIONS.map((location) => (
              <div key={location.city} className="rounded-2xl bg-white p-10">
                <Typography className="font-semibold text-foreground">
                  {location.city}
                </Typography>
                <address className="mt-3 space-y-1 not-italic">
                  <Typography className="text-sm">
                    {location.address}
                  </Typography>
                  <Typography className="text-sm">
                    {location.postalCode}
                  </Typography>
                </address>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

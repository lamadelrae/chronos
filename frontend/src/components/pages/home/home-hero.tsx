import Image from 'next/image'

import { BrandGradient } from '@/components/brand-gradient'
import { Button } from '@/components/ui/button'

export function HomeHero() {
  return (
    <div className="relative isolate select-none min-h-screen">
      <BrandGradient />

      <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
          <div className="relative w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Transforme sua gestão de estoque hoje
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:max-w-md lg:max-w-none">
              O Chronos utiliza inteligência artificial para prever demandas e
              otimizar o controle de estoque em sua loja de varejo. Reduza
              perdas, aumente seus lucros e tome decisões estratégicas com
              facilidade. Descubra uma maneira mais inteligente de gerenciar seu
              negócio.
            </p>
            <div className="mt-10 flex items-center gap-4 flex-col sm:flex-row w-full sm:w-fit">
              <Button variant="accent" className="w-full">
                Experimente agora
              </Button>
              <Button variant="outline" className="w-full">
                Veja uma demonstração
              </Button>
            </div>
          </div>
          <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0 select-none">
            <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
              <div className="relative">
                <Image
                  priority
                  height={264}
                  width={176}
                  alt="Dono confiantemente segura um tablet e mostra as previsões de estoque de sua loja."
                  src="/marketing/marketing_home_hero_1.webp"
                  className="aspect-[2/3] w-full rounded-xl bg-primary-foreground/5 object-cover shadow-lg"
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-primary-foreground/10" />
              </div>
            </div>
            <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
              <div className="relative">
                <Image
                  priority
                  height={264}
                  width={176}
                  alt="Mulher segura tablet e prevê demandas em supermercado usando o app Chronos."
                  src="/marketing/marketing_home_hero_2.webp"
                  className="aspect-[2/3] w-full rounded-xl bg-primary-foreground/5 object-cover shadow-lg"
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-primary-foreground/10" />
              </div>
              <div className="relative">
                <Image
                  priority
                  height={264}
                  width={176}
                  alt="Homem segura tablet e prevê demandas em supermercado usando o app Chronos."
                  src="/marketing/marketing_home_hero_3.webp"
                  className="aspect-[2/3] w-full rounded-xl bg-primary-foreground/5 object-cover shadow-lg"
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-primary-foreground/10" />
              </div>
            </div>
            <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
              <div className="relative">
                <Image
                  priority
                  height={264}
                  width={176}
                  alt="Notebook utilizando o app chronos mostrando gráficos de previsão de demanda."
                  src="/marketing/marketing_home_hero_4.webp"
                  className="aspect-[2/3] w-full rounded-xl bg-primary-foreground/5 object-cover shadow-lg"
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-primary-foreground/10" />
              </div>
              <div className="relative">
                <Image
                  priority
                  height={264}
                  width={176}
                  alt="Gerente de armazem mostra como o app Chronos ajuda a prever demanda utilizando um tablet."
                  src="/marketing/marketing_home_hero_5.webp"
                  className="aspect-[2/3] w-full rounded-xl bg-primary-foreground/5 object-cover shadow-lg"
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-primary-foreground/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

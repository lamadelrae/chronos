import { Metadata } from 'next'

import { MarketingFooter } from '@/components/marketing/navigation/footer'
import { MarketingHeader } from '@/components/marketing/navigation/header'
import { HomeCTA } from '@/components/pages/home/home-cta'
import { HomeFeatures } from '@/components/pages/home/home-features'
import { HomeFeaturesAlt } from '@/components/pages/home/home-features-alt'
import { HomeHero } from '@/components/pages/home/home-hero'
import { HomePricing } from '@/components/pages/home/home-pricing'
import { HomeTrust } from '@/components/pages/home/home-trust'

export const metadata: Metadata = {
  title: 'Chronos - Gestão Inteligente de Estoque',
  description:
    'Transforme sua gestão de estoque com inteligência artificial. O Chronos oferece previsão de demanda, otimização de estoque e insights acionáveis para varejistas.',
}

export default function Home() {
  return (
    <>
      <MarketingHeader />

      <main>
        <div className="overflow-hidden">
          <HomeHero />
          <HomeFeatures />
          <HomeTrust />
          <HomeFeaturesAlt />
          <HomePricing />
          <HomeCTA />
        </div>
      </main>

      <MarketingFooter />
    </>
  )
}

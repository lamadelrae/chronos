import { MarketingFooter } from '@/components/marketing/navigation/footer'
import { MarketingHeader } from '@/components/marketing/navigation/header'
import { HomeCTA } from '@/components/pages/home/home-cta'
import { HomeFeatures } from '@/components/pages/home/home-features'
import { HomeFeaturesAlt } from '@/components/pages/home/home-features-alt'
import { HomeHero } from '@/components/pages/home/home-hero'
import { HomePricing } from '@/components/pages/home/home-pricing'
import { HomeTrust } from '@/components/pages/home/home-trust'

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

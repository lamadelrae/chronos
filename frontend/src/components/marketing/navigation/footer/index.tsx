import Link from 'next/link'
import React from 'react'

import { ChronosLogo } from '@/components/icons/chronos-logo'
import { AvatarCircles } from '@/components/ui/avatar-circles'
import { Typography } from '@/components/ui/typography'
import { MARKETING_NAVIGATION } from '@/constants/marketing-navigation'
import { SOCIAL_MEDIA_NAVIGATION } from '@/constants/social-media-navigation'

import { MarketingFooterNewsletter } from './newsletter'

const avatarUrls = [
  'https://avatars.githubusercontent.com/u/67398608',
  'https://avatars.githubusercontent.com/u/80175682',
  'https://avatars.githubusercontent.com/u/95034183',
  'https://avatars.githubusercontent.com/u/55630599',
]

export function MarketingFooter() {
  return (
    <React.Fragment>
      <MarketingFooterNewsletter />

      <footer className="bg-zinc-100">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8 flex flex-col sm:flex-row justify-between items-start">
          <div className="flex-1 mb-10 sm:mb-0">
            <Link
              href="/"
              className="inline-flex flex-col items-center gap-2.5"
            >
              <ChronosLogo
                size={40}
                className="text-foreground mx-auto sm:mx-0"
              />
            </Link>

            <div className="flex items-center mt-6">
              <Typography className="text-lg text-foreground font-semibold">
                Feito com ❤️ por
              </Typography>

              <AvatarCircles className="ml-4" avatarUrls={avatarUrls} />
            </div>

            <Typography className="mt-4 text-xs">
              Chronos é um software inteligente de predição de estoque e demanda
              para varejistas. Otimize a gestão de seu estoque, evite perdas e
              maximize seus lucros com previsões precisas e insights acionáveis.
              Deixe nossa tecnologia ajudá-lo a tomar decisões estratégicas com
              confiança e facilidade.
            </Typography>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <nav
              className="flex flex-col gap-4 sm:gap-12 sm:justify-end sm:flex-row"
              aria-label="Footer"
            >
              {MARKETING_NAVIGATION.map((item) => (
                <Typography key={item.name} variant="span" className="block">
                  <Link href={item.path}>{item.name}</Link>
                </Typography>
              ))}
            </nav>

            <div className="mt-14 flex justify-start sm:justify-end space-x-10">
              {SOCIAL_MEDIA_NAVIGATION.map((item) => (
                <Typography key={item.name} variant="span">
                  <Link href={item.path}>
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </Link>
                </Typography>
              ))}
            </div>

            <Typography className="mt-14 text-center sm:text-right text-xs">
              &copy; {new Date().getFullYear()} Chronos. Todos os direitos
              reservados.
            </Typography>
          </div>
        </div>
      </footer>
    </React.Fragment>
  )
}

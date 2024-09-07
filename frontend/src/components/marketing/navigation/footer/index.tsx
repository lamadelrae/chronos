import Link from 'next/link'
import React from 'react'

import { ChronosLogo } from '@/components/icons/chronos-logo'
import { AvatarCircles } from '@/components/ui/avatar-circles'
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
                className="text-gray-900 mx-auto sm:mx-0"
              />
            </Link>
            <h2 className="mt-6 text-lg font-semibold text-gray-900 flex items-center">
              Feito com ❤️ por
              <div className="ml-4">
                <AvatarCircles avatarUrls={avatarUrls} />
              </div>
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              Chronos é um software inteligente de predição de estoque e demanda
              para varejistas. Otimize a gestão de seu estoque, evite perdas e
              maximize seus lucros com previsões precisas e insights acionáveis.
              Deixe nossa tecnologia ajudá-lo a tomar decisões estratégicas com
              confiança e facilidade.
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <nav
              className="sm:flex sm:justify-end sm:space-x-12"
              aria-label="Footer"
            >
              {MARKETING_NAVIGATION.map((item) => (
                <div key={item.name} className="pb-6">
                  <a
                    href={item.path}
                    className="text-sm leading-6 text-gray-700 hover:text-gray-900"
                  >
                    {item.name}
                  </a>
                </div>
              ))}
            </nav>

            <div className="mt-10 flex justify-center sm:justify-end space-x-10">
              {SOCIAL_MEDIA_NAVIGATION.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className="text-gray-700 hover:text-gray-500"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>

            <p className="mt-10 text-center sm:text-right text-xs leading-5 text-gray-500">
              &copy; {new Date().getFullYear()} Chronos. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </React.Fragment>
  )
}

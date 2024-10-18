'use client'

import { useEffect } from 'react'

interface ChatwootSettings {
  hideMessageBubble: boolean
  position: 'left' | 'right'
  locale: string
  type: 'standard' | 'expanded_bubble'
}

interface ChatwootSDK {
  run: (config: { websiteToken: string; baseUrl: string }) => void
}

declare global {
  interface Window {
    chatwootSettings?: ChatwootSettings
    chatwootSDK?: ChatwootSDK
  }
}

export default function ChatWootWidget() {
  useEffect(() => {
    // Add Chatwoot Settings
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: 'right',
      locale: 'en',
      type: 'standard',
    }
    ;(function (d: Document, t: string) {
      const BASE_URL = 'https://app.chatwoot.com'
      const g = d.createElement(t) as HTMLScriptElement
      const s = d.getElementsByTagName(t)[0]
      g.src = BASE_URL + '/packs/js/sdk.js'
      if (s && s.parentNode) {
        s.parentNode.insertBefore(g, s)
      }
      g.async = true
      g.onload = function () {
        window.chatwootSDK?.run({
          websiteToken: 'UnKM1XcEJ1Aj8U2Ap3PbcoF6',
          baseUrl: BASE_URL,
        })
      }
    })(document, 'script')
  }, [])

  return null
}

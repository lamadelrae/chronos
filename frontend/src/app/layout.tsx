import './globals.css'

import type { Metadata } from 'next'
import { Plus_Jakarta_Sans as plusJakartaSans } from 'next/font/google'

const jakartaSans = plusJakartaSans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chronos',
  description: 'Chronos',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${jakartaSans.className} bg-background`}>
        {children}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'

import '@/styles/globals.css'
import { cn } from '@/lib/utils'
import { fontSans } from '@/lib/fonts'
import { siteConfig } from '@/config/site'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'Notes',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>{children}</body>
      </html>
    </Providers>
  )
}

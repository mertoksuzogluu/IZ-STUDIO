import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { SessionProvider } from '@/components/SessionProvider'
import GlobalThemeWrapper from '@/components/GlobalThemeWrapper'
import { getActiveSpecialTheme } from '@/lib/settings'
import { getSiteCopy, DEFAULT_SITE_COPY } from '@/lib/siteCopy'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://feelcreativestudio.com'

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Feel Studio | Sinematik Kısa Filmler',
  description: 'Sizin hikâyenizden sinematik kısa filmler. Bir iz, bir ömür.',
  openGraph: {
    title: 'Feel Studio | Sinematik Kısa Filmler',
    description: 'Sizin hikâyenizden sinematik kısa filmler. Bir iz, bir ömür.',
    type: 'website',
    url: siteUrl,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const timeoutMs = 5000
  let siteTheme: string = "default"
  let siteCopy = DEFAULT_SITE_COPY
  try {
    const result = await Promise.race([
      Promise.all([getActiveSpecialTheme(), getSiteCopy()]),
      new Promise<[string, typeof DEFAULT_SITE_COPY]>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), timeoutMs)
      ),
    ])
    siteTheme = result[0]
    siteCopy = result[1]
  } catch {
    // Zaman aşımı veya DB hatası: varsayılanlarla render et, site donmasın
  }
  return (
    <html lang="tr" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <SessionProvider>
          <GlobalThemeWrapper themeKey={siteTheme}>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter tagline={siteCopy.footerTagline} />
          </GlobalThemeWrapper>
        </SessionProvider>
      </body>
    </html>
  )
}



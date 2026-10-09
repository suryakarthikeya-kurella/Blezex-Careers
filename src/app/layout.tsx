import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google'
import { SITE } from '@/lib/site'
import { organizationLd } from '@/lib/jsonld'
import { JsonLd } from '@/components/site/json-ld'
import './globals.css'

const heading = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-heading', display: 'swap' })
const sans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `Careers at ${SITE.name} | ${SITE.tagline}`, template: `%s | ${SITE.name} Careers` },
  description: SITE.description,
  keywords: ['BlezeX careers', 'internships', 'AI jobs', 'business development jobs', 'digital marketing internship', 'campus representative', 'freshers jobs India'],
  applicationName: `${SITE.name} Careers`,
  alternates: { canonical: '/' },
  icons: { icon: '/logo.jpeg', apple: '/logo.jpeg' },
  openGraph: {
    type: 'website', url: SITE.url, siteName: `${SITE.name} Careers`, locale: 'en_IN',
    title: `Careers at ${SITE.name} | ${SITE.tagline}`, description: SITE.description,
    images: [{ url: '/logo.jpeg', width: 800, height: 800, alt: 'BlezeX logo' }],
  },
  twitter: { card: 'summary', title: `Careers at ${SITE.name}`, description: SITE.description, images: ['/logo.jpeg'] },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { themeColor: '#FF4D1C', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${sans.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:p-3 focus:font-bold">Skip to content</a>
        <JsonLd data={organizationLd} />
        {children}
      </body>
    </html>
  )
}

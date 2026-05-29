import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import SeoSchema from '@/components/SeoSchema'

export const metadata: Metadata = {
  title: 'FenaQuery — Developer Toolkit by FENAXRA',
  description:
    'Free, fully client-side web utility tools for modern developers. Securely convert SQL to MongoDB, JSON to SQL, JSON to types, format or minify JSON, and encrypt data instantly inside your browser.',
  keywords: [
    'SQL to MongoDB aggregation converter',
    'JSON to types converter',
    'JSON to SQL converter',
    'JSON beautifier',
    'JSON validator',
    'client-side encryption tool',
    'free developer tools',
    'FENAXRA',
    'FenaQuery'
  ],
  metadataBase: new URL('https://fenaquery.fenaxra.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fenaquery.fenaxra.com',
    title: 'FenaQuery — Developer Toolkit by FENAXRA',
    description: 'Free, client-side developer utility tools. Convert SQL to MongoDB, JSON to SQL, JSON to TypeScript/Go, beautify, minify, and encrypt data instantly.',
    siteName: 'FenaQuery',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FenaQuery — Developer Toolkit by FENAXRA',
    description: 'Free, client-side developer utility tools. 100% private, runs entirely in the browser.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <ThemeProvider>
          <SeoSchema
            name="FenaQuery"
            description="Free, fully client-side web utility tools for modern developers. Securely convert SQL to MongoDB, JSON to SQL, JSON to types, format or minify JSON, and encrypt data instantly inside your browser."
            url="https://fenaquery.fenaxra.com"
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


import type { Metadata } from 'next'
import SeoSchema from '@/components/SeoSchema'

export const metadata: Metadata = {
  title: 'JSON Beautifier, Formatter & Validator — FenaQuery',
  description:
    'Free online client-side JSON beautifier and validator. Format, validate, inspect, and analyze depth and statistics of your JSON payloads in real-time securely.',
  keywords: [
    'JSON Beautifier',
    'JSON Formatter',
    'JSON Validator',
    'pretty print JSON online',
    'validate JSON schema',
    'client-side JSON beautifier',
  ],
  alternates: {
    canonical: '/json-beautifier',
  },
  openGraph: {
    title: 'JSON Beautifier, Formatter & Validator — FenaQuery',
    description: 'Format, validate, pretty-print, and inspect your JSON data with real-time statistics and depth analysis.',
    url: 'https://fenaquery.fenaxra.com/json-beautifier',
  },
}

export default function JsonBeautifierLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SeoSchema
        name="JSON Beautifier & Validator"
        description="Format, pretty-print, validate, and inspect your JSON data client-side with full syntax highlighting and metrics."
        url="https://fenaquery.fenaxra.com/json-beautifier"
      />
      {children}
    </>
  )
}

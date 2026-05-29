import type { Metadata } from 'next'
import SeoSchema from '@/components/SeoSchema'

export const metadata: Metadata = {
  title: 'JSON Minifier & Compressor — FenaQuery',
  description:
    'Compress and minify your JSON data instantly. Remove unnecessary whitespace, newlines, and characters to optimize payload size for production and API requests.',
  keywords: [
    'JSON Minifier',
    'JSON Compressor',
    'minify JSON online',
    'shrink JSON size',
    'remove whitespace from JSON',
    'optimize JSON payload',
  ],
  alternates: {
    canonical: '/json-minifier',
  },
  openGraph: {
    title: 'JSON Minifier & Compressor — FenaQuery',
    description: 'Compress and minify your JSON data instantly to optimize payload size for production and API requests.',
    url: 'https://fenaquery.fenaxra.com/json-minifier',
  },
}

export default function JsonMinifierLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SeoSchema
        name="JSON Minifier & Compressor"
        description="Compress, shrink, and minify JSON data by stripping tabs, spaces, and newlines in your browser client-side."
        url="https://fenaquery.fenaxra.com/json-minifier"
      />
      {children}
    </>
  )
}

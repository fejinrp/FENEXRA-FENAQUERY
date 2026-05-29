import type { Metadata } from 'next'
import SeoSchema from '@/components/SeoSchema'

export const metadata: Metadata = {
  title: 'JSON to Array, Dict & Map Converter Online — FenaQuery',
  description:
    'Convert JSON to native arrays, dictionaries, and map representations for PHP, Python, JavaScript, and Dart client-side instantly.',
  keywords: [
    'JSON to PHP array',
    'JSON to Python dict',
    'JSON to Dart map',
    'JSON to JS object',
    'convert JSON to list',
    'array representation generator',
  ],
  alternates: {
    canonical: '/json-to-lang',
  },
  openGraph: {
    title: 'JSON to Array, Dict & Map Converter Online — FenaQuery',
    description: 'Convert JSON to native arrays, dictionaries, and map representations for PHP, Python, JavaScript, and Dart client-side instantly.',
    url: 'https://fenaquery.fenaxra.com/json-to-lang',
  },
}

export default function JsonToLangLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SeoSchema
        name="JSON to Language Array / List Converter"
        description="Convert JSON to native arrays, dictionaries, and map representations for PHP, Python, JavaScript, and Dart client-side instantly."
        url="https://fenaquery.fenaxra.com/json-to-lang"
      />
      {children}
    </>
  )
}

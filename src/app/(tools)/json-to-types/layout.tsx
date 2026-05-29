import type { Metadata } from 'next'
import SeoSchema from '@/components/SeoSchema'

export const metadata: Metadata = {
  title: 'JSON to Types Converter (TypeScript, Go, Python, C#) — FenaQuery',
  description:
    'Instantly generate clean interface and type definitions from JSON samples. Supports TypeScript interfaces, Go structs, Python classes, and C# classes completely client-side.',
  keywords: [
    'JSON to TypeScript',
    'JSON to Go structs',
    'JSON to Python classes',
    'JSON to C# classes',
    'JSON interface generator',
    'JSON type definitions',
    'online JSON to types converter',
  ],
  alternates: {
    canonical: '/json-to-types',
  },
  openGraph: {
    title: 'JSON to Types Converter (TypeScript, Go, Python, C#) — FenaQuery',
    description: 'Instantly generate clean interface and type definitions (TypeScript, Go, Python, C#) from JSON samples.',
    url: 'https://fenaquery.fenaxra.com/json-to-types',
  },
}

export default function JsonToTypesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SeoSchema
        name="JSON to Types Converter"
        description="Instantly convert JSON payload samples to TypeScript interfaces, Go structs, Python classes, and C# type definitions client-side."
        url="https://fenaquery.fenaxra.com/json-to-types"
      />
      {children}
    </>
  )
}

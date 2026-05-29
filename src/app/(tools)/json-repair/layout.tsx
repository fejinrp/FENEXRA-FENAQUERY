import type { Metadata } from 'next'
import SeoSchema from '@/components/SeoSchema'

export const metadata: Metadata = {
  title: 'JSON Repair & Auto-Fixer Online — FenaQuery',
  description:
    'Instantly repair and fix broken JSON strings client-side. Automatically resolve trailing commas, single quotes, unquoted keys, and missing braces securely.',
  keywords: [
    'JSON Repair',
    'Fix broken JSON',
    'JSON Auto Fixer',
    'JSON Lint repair',
    'client-side JSON repair',
    'repair JSON trailing comma',
    'JSON format fixer',
  ],
  alternates: {
    canonical: '/json-repair',
  },
  openGraph: {
    title: 'JSON Repair & Auto-Fixer Online — FenaQuery',
    description: 'Instantly repair broken JSON strings client-side. Automatically resolve trailing commas, single quotes, unquoted keys, and missing braces securely.',
    url: 'https://fenaquery.fenaxra.com/json-repair',
  },
}

export default function JsonRepairLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SeoSchema
        name="JSON Repair & Auto-Fixer"
        description="Instantly repair broken JSON strings client-side. Automatically resolve trailing commas, single quotes, unquoted keys, and missing braces securely."
        url="https://fenaquery.fenaxra.com/json-repair"
      />
      {children}
    </>
  )
}

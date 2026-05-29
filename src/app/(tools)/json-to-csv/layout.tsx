import type { Metadata } from 'next'
import SeoSchema from '@/components/SeoSchema'

export const metadata: Metadata = {
  title: 'JSON to CSV & Excel Converter Online — FenaQuery',
  description:
    'Convert nested JSON payloads to standard CSV and Microsoft Excel files client-side. Convert CSV data back into structured JSON arrays securely.',
  keywords: [
    'JSON to CSV',
    'CSV to JSON',
    'JSON to Excel converter',
    'Excel to JSON',
    'client-side CSV generator',
    'flatten JSON to spreadsheet',
  ],
  alternates: {
    canonical: '/json-to-csv',
  },
  openGraph: {
    title: 'JSON to CSV & Excel Converter Online — FenaQuery',
    description: 'Convert nested JSON payloads to standard CSV and Microsoft Excel files client-side. Convert CSV data back into structured JSON arrays securely.',
    url: 'https://fenaquery.fenaxra.com/json-to-csv',
  },
}

export default function JsonToCsvLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SeoSchema
        name="JSON to CSV & Excel Converter"
        description="Convert nested JSON payloads to standard CSV and Microsoft Excel files client-side. Convert CSV data back into structured JSON arrays securely."
        url="https://fenaquery.fenaxra.com/json-to-csv"
      />
      {children}
    </>
  )
}

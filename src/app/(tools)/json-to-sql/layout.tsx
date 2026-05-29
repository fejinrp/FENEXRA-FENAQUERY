import type { Metadata } from 'next'
import SeoSchema from '@/components/SeoSchema'

export const metadata: Metadata = {
  title: 'JSON to SQL INSERT Converter — FenaQuery',
  description:
    'Convert JSON arrays or objects into SQL INSERT statements instantly. Generate clean, ready-to-run queries for PostgreSQL, MySQL, and MSSQL (SQL Server) client-side.',
  keywords: [
    'JSON to SQL',
    'JSON to SQL INSERT generator',
    'convert JSON array to SQL',
    'JSON to PostgreSQL INSERT',
    'JSON to MySQL',
    'JSON to MSSQL',
  ],
  alternates: {
    canonical: '/json-to-sql',
  },
  openGraph: {
    title: 'JSON to SQL INSERT Converter — FenaQuery',
    description: 'Convert JSON arrays or objects into PostgreSQL, MySQL, and MSSQL INSERT statements instantly.',
    url: 'https://fenaquery.fenaxra.com/json-to-sql',
  },
}

export default function JsonToSqlLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SeoSchema
        name="JSON to SQL INSERT Converter"
        description="Convert JSON arrays or objects into standard SQL INSERT statements for MySQL, PostgreSQL, and MSSQL in your browser securely."
        url="https://fenaquery.fenaxra.com/json-to-sql"
      />
      {children}
    </>
  )
}

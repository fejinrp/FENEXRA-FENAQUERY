import type { Metadata } from 'next'
import SeoSchema from '@/components/SeoSchema'

export const metadata: Metadata = {
  title: 'SQL to MongoDB Converter — FenaQuery',
  description:
    'Free online client-side tool to convert SQL queries (SELECT, INSERT, UPDATE, DELETE, and complex INNER JOINs) into MongoDB query syntax and aggregation pipelines instantly.',
  keywords: [
    'SQL to MongoDB',
    'SQL to MongoDB aggregation pipeline',
    'SQL to Mongo converter',
    'convert SQL query to MongoDB schema',
    'translate SQL to MongoDB',
    'free client side SQL to MongoDB',
  ],
  alternates: {
    canonical: '/sql-to-mongo',
  },
  openGraph: {
    title: 'SQL to MongoDB Converter — FenaQuery',
    description: 'Convert SQL queries (SELECT, INSERT, UPDATE, DELETE, and complex JOINs) to MongoDB aggregation pipelines instantly.',
    url: 'https://fenaquery.fenaxra.com/sql-to-mongo',
  },
}

export default function SqlToMongoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SeoSchema
        name="SQL to MongoDB Aggregation Converter"
        description="Convert SQL SELECT, INSERT, UPDATE, DELETE statements and JOINs to MongoDB query syntax and aggregation pipelines instantly in your browser."
        url="https://fenaquery.fenaxra.com/sql-to-mongo"
      />
      {children}
    </>
  )
}

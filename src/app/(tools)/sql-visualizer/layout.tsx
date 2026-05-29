import type { Metadata } from 'next'
import SeoSchema from '@/components/SeoSchema'

export const metadata: Metadata = {
  title: 'SQL Stored Procedure Visualizer Online — FenaQuery',
  description:
    'Free online client-side SQL Stored Procedure visualizer. Analyze inputs, parameters, variables, table dependencies, and execution flow charts securely.',
  keywords: [
    'SQL stored procedure visualizer',
    'stored procedure flow chart',
    'SQL parser diagram',
    'T-SQL procedure map',
    'database dependency analyzer',
    'stored procedure parameters extractor',
  ],
  alternates: {
    canonical: '/sql-visualizer',
  },
  openGraph: {
    title: 'SQL Stored Procedure Visualizer Online — FenaQuery',
    description: 'Instantly visualize parameters, table dependencies, and logical execution flowcharts from SQL Stored Procedures client-side securely.',
    url: 'https://fenaquery.fenaxra.com/sql-visualizer',
  },
}

export default function SqlVisualizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SeoSchema
        name="SQL Stored Procedure Visualizer"
        description="Instantly visualize parameters, table dependencies, and logical execution flowcharts from SQL Stored Procedures client-side securely."
        url="https://fenaquery.fenaxra.com/sql-visualizer"
      />
      {children}
    </>
  )
}

'use client'

import { useState, useCallback } from 'react'
import { ToolLayout } from '@/components/ui/ToolLayout'
import { EditorPanel } from '@/components/ui/EditorPanel'
import { ExamplesGrid } from '@/components/ui/ExamplesGrid'
import { convertSqlToMongo, highlightMongo } from '@/lib/tools/sqlToMongo'

const DIALECTS = ['mssql', 'mysql', 'postgres'] as const
type Dialect = typeof DIALECTS[number]

const EXAMPLES = [
  { label: 'SELECT WHERE', tag: 'SELECT', tagColor: '#2563eb', preview: "SELECT * FROM users WHERE age > 25", value: "SELECT * FROM users WHERE age > 25 AND status = 'active'" },
  { label: 'ORDER + LIMIT', tag: 'SELECT', tagColor: '#2563eb', preview: 'SELECT name, email FROM users...', value: "SELECT name, email FROM users ORDER BY created_at DESC LIMIT 10" },
  { label: 'LIKE search', tag: 'SELECT', tagColor: '#2563eb', preview: "WHERE name LIKE '%phone%'", value: "SELECT * FROM products WHERE name LIKE '%phone%'" },
  { label: 'IN clause', tag: 'SELECT', tagColor: '#2563eb', preview: "WHERE status IN ('a','b')", value: "SELECT * FROM orders WHERE status IN ('pending', 'processing')" },
  { label: 'IS NULL', tag: 'SELECT', tagColor: '#2563eb', preview: 'WHERE deleted_at IS NULL', value: 'SELECT * FROM customers WHERE deleted_at IS NULL' },
  { label: 'BETWEEN', tag: 'SELECT', tagColor: '#2563eb', preview: 'WHERE amount BETWEEN 100 AND 500', value: 'SELECT * FROM transactions WHERE amount BETWEEN 100 AND 500' },
  { label: 'INNER JOIN', tag: 'JOIN', tagColor: '#7c3aed', preview: 'INNER JOIN orders ON u.id = o.user_id', value: 'SELECT u.name, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE o.total > 100' },
  { label: 'INSERT', tag: 'INSERT', tagColor: '#00c37a', preview: "INSERT INTO users (name, email)...", value: "INSERT INTO users (name, email, age) VALUES ('John Doe', 'john@example.com', 30)" },
  { label: 'UPDATE SET', tag: 'UPDATE', tagColor: '#d97706', preview: 'UPDATE products SET price = 99.99', value: 'UPDATE products SET price = 99.99, stock = 50 WHERE id = 5' },
  { label: 'DELETE', tag: 'DELETE', tagColor: '#dc2626', preview: "DELETE FROM sessions WHERE...", value: "DELETE FROM sessions WHERE expires_at < '2024-01-01'" },
  { label: 'COUNT(*)', tag: 'SELECT', tagColor: '#2563eb', preview: "SELECT COUNT(*) FROM orders", value: "SELECT COUNT(*) FROM orders WHERE status = 'completed'" },
  { label: 'DISTINCT', tag: 'SELECT', tagColor: '#2563eb', preview: 'SELECT DISTINCT category FROM...', value: 'SELECT DISTINCT category FROM products WHERE active = 1' },
]

const dialectBtnStyle = (active: boolean) => ({
  padding: '4px 11px',
  borderRadius: 6,
  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
  background: active ? 'var(--accent-bg)' : 'var(--surface-2)',
  color: active ? 'var(--accent)' : 'var(--text-2)',
  fontSize: 10.5,
  fontFamily: 'var(--font-geist-mono)',
  cursor: 'pointer',
  fontWeight: 600,
  transition: 'all 0.15s',
})

export default function SqlToMongoPage() {
  const [dialect, setDialect] = useState<Dialect>('mssql')
  const [input, setInput] = useState('')
  const [outputText, setOutputText] = useState('')
  const [outputHtml, setOutputHtml] = useState('')
  const [queryType, setQueryType] = useState('')

  const convert = useCallback(() => {
    if (!input.trim()) return
    try {
      const result = convertSqlToMongo(input.trim(), dialect)
      setOutputText(result)
      setOutputHtml(highlightMongo(result))
      const up = input.trim().toUpperCase()
      setQueryType(
        up.startsWith('SELECT') ? 'SELECT' :
        up.startsWith('INSERT') ? 'INSERT' :
        up.startsWith('UPDATE') ? 'UPDATE' :
        up.startsWith('DELETE') ? 'DELETE' : ''
      )
    } catch (e) {
      const msg = `// Error: ${(e as Error).message}`
      setOutputText(msg)
      setOutputHtml(`<span class="syn-op">${msg}</span>`)
    }
  }, [input, dialect])

  const queryTypeColors: Record<string, string> = {
    SELECT: 'var(--blue)', INSERT: 'var(--accent)',
    UPDATE: 'var(--amber)', DELETE: 'var(--red)',
  }

  return (
    <ToolLayout
      title="SQL → MongoDB Converter"
      badge="LIVE"
      controls={
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10.5, color: 'var(--text-3)' }}>dialect:</span>
          {DIALECTS.map(d => (
            <button key={d} style={dialectBtnStyle(dialect === d)} onClick={() => setDialect(d)}>
              {d.toUpperCase()}
            </button>
          ))}
        </div>
      }
    >
      <EditorPanel
        inputLabel="SQL Input"
        outputLabel="MongoDB Output"
        inputDot="var(--blue)"
        outputDot="var(--accent)"
        inputPlaceholder={`-- Paste your SQL query here\n-- Supports SELECT, INSERT, UPDATE, DELETE, JOINs\n-- Press Ctrl+Enter to convert`}
        inputValue={input}
        outputValue={outputText}
        outputHtml={outputHtml || undefined}
        onInputChange={setInput}
        onConvert={convert}
        onClear={() => { setInput(''); setOutputText(''); setOutputHtml(''); setQueryType('') }}
        onRandomExample={() => {
          const ex = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]
          setInput(ex.value)
          setTimeout(convert, 0)
        }}
        downloadFilename="fenaquery-mongo.js"
        minHeight={300}
      />

      {/* Info bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '9px 14px',
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
        fontFamily: 'var(--font-geist-mono)', fontSize: 10.5, color: 'var(--text-3)',
        flexWrap: 'wrap',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          Ready · Ctrl+Enter to convert
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)', display: 'inline-block' }} />
          Dialect: {dialect.toUpperCase()}
        </span>
        {queryType && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: queryTypeColors[queryType], display: 'inline-block' }} />
            Query: {queryType}
          </span>
        )}
      </div>

      <ExamplesGrid
        examples={EXAMPLES}
        onSelect={val => { setInput(val); setTimeout(convert, 0) }}
      />
    </ToolLayout>
  )
}

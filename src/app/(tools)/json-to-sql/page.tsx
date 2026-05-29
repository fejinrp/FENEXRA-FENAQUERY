'use client'

import { useState, useCallback } from 'react'
import { ToolLayout } from '@/components/ui/ToolLayout'
import { EditorPanel } from '@/components/ui/EditorPanel'
import { ExamplesGrid } from '@/components/ui/ExamplesGrid'
import { convertJsonToSql, SqlDialect } from '@/lib/tools/jsonToSql'

const DIALECTS: { value: SqlDialect; label: string }[] = [
  { value: 'mssql',    label: 'MSSQL' },
  { value: 'mysql',    label: 'MySQL' },
  { value: 'postgres', label: 'PostgreSQL' },
]

const EXAMPLES = [
  {
    label: 'Single user', tag: 'object', tagColor: '#2563eb',
    preview: '{ name, email, age }',
    value: JSON.stringify({ name: 'John Doe', email: 'john@example.com', age: 30, active: true }, null, 2),
  },
  {
    label: 'Multiple users', tag: 'array', tagColor: '#7c3aed',
    preview: '[{ name, email }, ...]',
    value: JSON.stringify([
      { name: 'Alice', email: 'alice@example.com', role: 'admin' },
      { name: 'Bob',   email: 'bob@example.com',   role: 'user' },
      { name: 'Carol', email: 'carol@example.com',  role: 'user' },
    ], null, 2),
  },
  {
    label: 'Products batch', tag: 'array', tagColor: '#d97706',
    preview: '[{ sku, name, price }, ...]',
    value: JSON.stringify([
      { sku: 'WGT-001', name: 'Widget Pro', price: 49.99, stock: 100, active: true },
      { sku: 'WGT-002', name: 'Widget Lite', price: 19.99, stock: 250, active: true },
    ], null, 2),
  },
  {
    label: 'Order', tag: 'object', tagColor: '#00c37a',
    preview: '{ orderId, status, total }',
    value: JSON.stringify({ orderId: 'ORD-1001', userId: 5, status: 'pending', total: 149.99, notes: null }, null, 2),
  },
]

const btnStyle = (active: boolean) => ({
  padding: '4px 11px', borderRadius: 6,
  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
  background: active ? 'var(--accent-bg)' : 'var(--surface-2)',
  color: active ? 'var(--accent)' : 'var(--text-2)',
  fontSize: 10.5, fontFamily: 'var(--font-geist-mono)',
  cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s',
})

export default function JsonToSqlPage() {
  const [dialect, setDialect] = useState<SqlDialect>('mssql')
  const [tableName, setTableName] = useState('table_name')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const convert = useCallback(() => {
    if (!input.trim()) return
    try {
      const result = convertJsonToSql(input.trim(), tableName || 'table_name', dialect)
      setOutput(result)
    } catch (e) {
      setOutput(`-- Error: ${(e as Error).message}`)
    }
  }, [input, dialect, tableName])

  return (
    <ToolLayout
      title="JSON → SQL INSERT"
      badge="LIVE"
      controls={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {DIALECTS.map(d => (
            <button key={d.value} style={btnStyle(dialect === d.value)} onClick={() => setDialect(d.value)}>
              {d.label}
            </button>
          ))}
          <span style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 2px' }} />
          <input
            value={tableName}
            onChange={e => setTableName(e.target.value)}
            placeholder="table_name"
            style={{
              fontFamily: 'var(--font-geist-mono)', fontSize: 10.5,
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 6, padding: '4px 9px', color: 'var(--text)',
              width: 120, outline: 'none',
            }}
            title="Target table name"
          />
        </div>
      }
    >
      <EditorPanel
        inputLabel="JSON Input"
        outputLabel="SQL INSERT Output"
        inputDot="var(--amber)"
        outputDot="var(--purple)"
        inputPlaceholder={'[\n  { "col": "value" },\n  { "col": "value" }\n]'}
        inputValue={input}
        outputValue={output}
        onInputChange={setInput}
        onConvert={convert}
        onClear={() => { setInput(''); setOutput('') }}
        onRandomExample={() => {
          const ex = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]
          setInput(ex.value)
          setTimeout(convert, 0)
        }}
        downloadFilename="fenaquery-insert.sql"
        minHeight={300}
      />
      <ExamplesGrid examples={EXAMPLES} onSelect={v => { setInput(v); setTimeout(convert, 0) }} />
    </ToolLayout>
  )
}

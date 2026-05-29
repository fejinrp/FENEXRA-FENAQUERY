'use client'

import { useState, useCallback } from 'react'
import { ToolLayout } from '@/components/ui/ToolLayout'
import { EditorPanel } from '@/components/ui/EditorPanel'
import { ExamplesGrid } from '@/components/ui/ExamplesGrid'
import { convertJsonToTypes, TypeLang } from '@/lib/tools/jsonToTypes'

const LANGS: { value: TypeLang; label: string; ext: string }[] = [
  { value: 'typescript', label: 'TypeScript', ext: '.ts' },
  { value: 'csharp',     label: 'C#',         ext: '.cs' },
  { value: 'python',     label: 'Python',      ext: '.py' },
  { value: 'go',         label: 'Go',          ext: '.go' },
]

const EXAMPLES = [
  {
    label: 'User object', tag: 'object', tagColor: '#2563eb',
    preview: '{ id, name, email, ... }',
    value: JSON.stringify({ id: 1, name: 'John Doe', email: 'john@example.com', age: 30, active: true, createdAt: '2024-01-01' }, null, 2),
  },
  {
    label: 'API response', tag: 'nested', tagColor: '#7c3aed',
    preview: '{ data: { ... }, meta }',
    value: JSON.stringify({ data: { id: 42, title: 'Product', price: 9.99, inStock: true }, meta: { total: 100, page: 1, perPage: 20 } }, null, 2),
  },
  {
    label: 'Order with items', tag: 'array', tagColor: '#d97706',
    preview: '{ orderId, items: [...] }',
    value: JSON.stringify({ orderId: 'ORD-001', status: 'pending', total: 149.99, items: [{ productId: 1, name: 'Widget', qty: 2, price: 49.99 }], customer: { id: 5, name: 'Jane' } }, null, 2),
  },
  {
    label: 'Config object', tag: 'config', tagColor: '#00c37a',
    preview: '{ db, cache, server }',
    value: JSON.stringify({ database: { host: 'localhost', port: 5432, name: 'mydb', ssl: false }, cache: { ttl: 3600, maxSize: 1000 }, server: { port: 3000, debug: true } }, null, 2),
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

export default function JsonToTypesPage() {
  const [lang, setLang] = useState<TypeLang>('typescript')
  const [rootName, setRootName] = useState('Root')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const convert = useCallback(() => {
    if (!input.trim()) return
    try {
      const result = convertJsonToTypes(input.trim(), lang, rootName || 'Root')
      setOutput(result)
    } catch (e) {
      setOutput(`// Error: ${(e as Error).message}`)
    }
  }, [input, lang, rootName])

  const currentLang = LANGS.find(l => l.value === lang)!

  return (
    <ToolLayout
      title="JSON → Types"
      badge="LIVE"
      controls={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {LANGS.map(l => (
            <button key={l.value} style={btnStyle(lang === l.value)} onClick={() => setLang(l.value)}>
              {l.label}
            </button>
          ))}
          <span style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 2px' }} />
          <input
            value={rootName}
            onChange={e => setRootName(e.target.value)}
            placeholder="Root"
            style={{
              fontFamily: 'var(--font-geist-mono)', fontSize: 10.5,
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 6, padding: '4px 9px', color: 'var(--text)',
              width: 90, outline: 'none',
            }}
            title="Root class/interface name"
          />
        </div>
      }
    >
      <EditorPanel
        inputLabel="JSON Input"
        outputLabel={`${currentLang.label} Output`}
        inputDot="var(--amber)"
        outputDot="var(--blue)"
        inputPlaceholder={'{\n  "key": "value"\n}'}
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
        downloadFilename={`fenaquery-types${currentLang.ext}`}
        minHeight={320}
      />
      <ExamplesGrid examples={EXAMPLES} onSelect={v => { setInput(v); setTimeout(convert, 0) }} />
    </ToolLayout>
  )
}

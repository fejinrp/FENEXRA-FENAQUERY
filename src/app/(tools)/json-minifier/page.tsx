'use client'

import { useState, useCallback } from 'react'
import { ToolLayout } from '@/components/ui/ToolLayout'
import { EditorPanel } from '@/components/ui/EditorPanel'
import { minifyJson, validateJson } from '@/lib/tools/jsonBeautifier'

const EXAMPLES_RAW = [
  { label: 'Config object', tag: 'config', tagColor: '#2563eb', preview: '{ db: {...}, cache: {...} }', value: JSON.stringify({ database: { host: 'localhost', port: 5432, name: 'prod_db', ssl: true }, cache: { ttl: 3600, maxSize: 1000 }, server: { port: 3000, debug: false } }, null, 2) },
  { label: 'API payload', tag: 'api', tagColor: '#7c3aed', preview: '{ data: [...], meta: {...} }', value: JSON.stringify({ data: [{ id: 1, name: 'Item A' }, { id: 2, name: 'Item B' }], meta: { total: 2, page: 1, perPage: 20 } }, null, 2) },
]

export default function JsonMinifierPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [savings, setSavings] = useState<string | null>(null)

  const convert = useCallback(() => {
    if (!input.trim()) return
    const v = validateJson(input.trim())
    if (!v.valid) { setOutput(`// Invalid JSON: ${v.error}`); setSavings(null); return }
    try {
      const result = minifyJson(input.trim())
      setOutput(result)
      const orig = new TextEncoder().encode(input.trim()).length
      const min = new TextEncoder().encode(result).length
      const pct = Math.round((1 - min / orig) * 100)
      setSavings(`${orig}B → ${min}B (${pct}% smaller)`)
    } catch (e) {
      setOutput(`// Error: ${(e as Error).message}`)
    }
  }, [input])

  return (
    <ToolLayout title="JSON Minifier" badge="LIVE">
      <EditorPanel
        inputLabel="JSON Input (formatted)"
        outputLabel="Minified Output"
        inputDot="var(--amber)"
        outputDot="var(--red)"
        inputPlaceholder={'{\n  "key": "value"\n}'}
        inputValue={input}
        outputValue={output}
        onInputChange={setInput}
        onConvert={convert}
        onClear={() => { setInput(''); setOutput(''); setSavings(null) }}
        onRandomExample={() => {
          const ex = EXAMPLES_RAW[Math.floor(Math.random() * EXAMPLES_RAW.length)]
          setInput(ex.value); setTimeout(convert, 0)
        }}
        downloadFilename="fenaquery-minified.json"
        minHeight={280}
      />
      {savings && (
        <div style={{ padding: '9px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'var(--font-geist-mono)', fontSize: 10.5, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          {savings}
        </div>
      )}
    </ToolLayout>
  )
}

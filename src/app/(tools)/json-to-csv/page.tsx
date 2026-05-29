'use client'

import { useState, useCallback } from 'react'
import { ToolLayout } from '@/components/ui/ToolLayout'
import { EditorPanel } from '@/components/ui/EditorPanel'
import { ExamplesGrid } from '@/components/ui/ExamplesGrid'
import { jsonToCsv, csvToJson } from '@/lib/tools/jsonCsv'
import { highlightJson } from '@/lib/tools/jsonBeautifier'

const MODE_OPTIONS = [
  { id: 'json2csv', label: 'JSON → CSV' },
  { id: 'csv2json', label: 'CSV → JSON' },
] as const
type Mode = typeof MODE_OPTIONS[number]['id']

const EXAMPLES = [
  {
    label: 'Nested Array of Users', tag: 'json', tagColor: '#2563eb',
    preview: '[{"id": 1, "profile": {...}}, ...]',
    value: `[\n  {\n    "id": 1,\n    "name": "Alice",\n    "profile": {\n      "role": "admin",\n      "active": true\n    }\n  },\n  {\n    "id": 2,\n    "name": "Bob",\n    "profile": {\n      "role": "user",\n      "active": false\n    }\n  }\n]`,
  },
  {
    label: 'Standard CSV File', tag: 'csv', tagColor: '#d97706',
    preview: 'id,name,profile.role\n1,Alice,admin\n...',
    value: `id,name,profile.role,profile.active\r\n1,Alice,admin,true\r\n2,Bob,user,false`,
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

export default function JsonToCsvPage() {
  const [mode, setMode] = useState<Mode>('json2csv')
  const [input, setInput] = useState('')
  const [outputText, setOutputText] = useState('')
  const [outputHtml, setOutputHtml] = useState('')
  const [error, setError] = useState<string | null>(null)

  const convert = useCallback(() => {
    if (!input.trim()) return
    setError(null)
    try {
      if (mode === 'json2csv') {
        const csv = jsonToCsv(input.trim())
        setOutputText(csv)
        setOutputHtml('') // CSV uses raw plain text inside editor
      } else {
        const json = csvToJson(input.trim())
        setOutputText(json)
        setOutputHtml(highlightJson(json))
      }
    } catch (e) {
      setError((e as Error).message)
      setOutputText(`// Error: ${(e as Error).message}`)
      setOutputHtml(`<span class="syn-op">// Error: ${(e as Error).message}</span>`)
    }
  }, [input, mode])

  return (
    <ToolLayout
      title="JSON ↔ CSV & Excel Converter"
      badge="NEW"
      controls={
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {MODE_OPTIONS.map(opt => (
            <button key={opt.id} style={btnStyle(mode === opt.id)} onClick={() => {
              setMode(opt.id)
              setInput('')
              setOutputText('')
              setOutputHtml('')
              setError(null)
            }}>
              {opt.label}
            </button>
          ))}
        </div>
      }
    >
      <EditorPanel
        inputLabel={mode === 'json2csv' ? 'Nested JSON Input' : 'Raw CSV Input'}
        outputLabel={mode === 'json2csv' ? 'Generated CSV Output' : 'Structured JSON Output'}
        inputDot={mode === 'json2csv' ? 'var(--accent)' : 'var(--amber)'}
        outputDot={mode === 'json2csv' ? 'var(--amber)' : 'var(--accent)'}
        inputPlaceholder={mode === 'json2csv' ? '[{"key":"value","nested":{"a":1}}]' : 'key,nested.a\r\nvalue,1'}
        inputValue={input}
        outputValue={outputText}
        outputHtml={outputHtml || undefined}
        onInputChange={setInput}
        onConvert={convert}
        onClear={() => { setInput(''); setOutputText(''); setOutputHtml(''); setError(null) }}
        onRandomExample={() => {
          const ex = mode === 'json2csv' ? EXAMPLES[0] : EXAMPLES[1]
          setInput(ex.value)
          setTimeout(convert, 0)
        }}
        downloadFilename={mode === 'json2csv' ? 'fenaquery-data.csv' : 'fenaquery-data.json'}
        minHeight={300}
      />

      {error && (
        <div style={{
          padding: '10px 16px', background: 'var(--surface-2)',
          border: '1px solid var(--red)', borderRadius: 10,
          fontFamily: 'var(--font-geist-mono)', fontSize: 10.5,
          color: 'var(--red)', fontWeight: 600,
        }}>
          Error: {error}
        </div>
      )}

      <ExamplesGrid examples={EXAMPLES} onSelect={v => { setInput(v); setTimeout(convert, 0) }} />
    </ToolLayout>
  )
}

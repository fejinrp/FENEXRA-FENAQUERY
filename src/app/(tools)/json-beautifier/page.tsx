'use client'

import { useState, useCallback } from 'react'
import { ToolLayout } from '@/components/ui/ToolLayout'
import { EditorPanel } from '@/components/ui/EditorPanel'
import { ExamplesGrid } from '@/components/ui/ExamplesGrid'
import { beautifyJson, highlightJson, validateJson, getJsonStats } from '@/lib/tools/jsonBeautifier'

const INDENT_OPTIONS = [2, 4] as const
type Indent = typeof INDENT_OPTIONS[number]

const EXAMPLES = [
  {
    label: 'Minified JSON', tag: 'minified', tagColor: '#d97706',
    preview: '{"id":1,"name":"Alice",...}',
    value: '{"id":1,"name":"Alice","email":"alice@example.com","role":"admin","active":true,"score":98.5}',
  },
  {
    label: 'Broken JSON', tag: 'fix', tagColor: '#dc2626',
    preview: "{'key': 'single quotes'}",
    value: `{"users":[{"id":1,"name":"John","tags":["admin","user"]},{"id":2,"name":"Jane","tags":["user"]}],"total":2}`,
  },
  {
    label: 'Nested object', tag: 'nested', tagColor: '#7c3aed',
    preview: '{ config: { db: {...} } }',
    value: '{"app":{"name":"FenaQuery","version":"1.0.0","config":{"db":{"host":"localhost","port":5432},"cache":{"ttl":3600}},"features":["sql-mongo","json-types"]}}',
  },
  {
    label: 'Array of records', tag: 'array', tagColor: '#2563eb',
    preview: '[{...},{...}]',
    value: '[{"id":1,"product":"Widget","price":49.99,"qty":10},{"id":2,"product":"Gadget","price":99.99,"qty":5},{"id":3,"product":"Doohickey","price":14.99,"qty":100}]',
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

export default function JsonBeautifierPage() {
  const [indent, setIndent] = useState<Indent>(2)
  const [input, setInput] = useState('')
  const [outputText, setOutputText] = useState('')
  const [outputHtml, setOutputHtml] = useState('')
  const [validation, setValidation] = useState<{ valid: boolean; error?: string } | null>(null)
  const [stats, setStats] = useState<{ keys: number; depth: number; size: string } | null>(null)

  const convert = useCallback(() => {
    if (!input.trim()) return
    const v = validateJson(input.trim())
    setValidation(v)
    if (!v.valid) {
      setOutputText(`// Invalid JSON:\n// ${v.error}`)
      setOutputHtml(`<span class="syn-op">// Invalid JSON:\n// ${v.error}</span>`)
      return
    }
    try {
      const result = beautifyJson(input.trim(), indent)
      setOutputText(result)
      setOutputHtml(highlightJson(result))
      setStats(getJsonStats(input.trim()))
    } catch (e) {
      setOutputText(`// Error: ${(e as Error).message}`)
      setOutputHtml(`<span class="syn-op">// Error: ${(e as Error).message}</span>`)
    }
  }, [input, indent])

  return (
    <ToolLayout
      title="JSON Beautifier"
      badge="LIVE"
      controls={
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10.5, color: 'var(--text-3)' }}>indent:</span>
          {INDENT_OPTIONS.map(n => (
            <button key={n} style={btnStyle(indent === n)} onClick={() => setIndent(n)}>
              {n} spaces
            </button>
          ))}
        </div>
      }
    >
      <EditorPanel
        inputLabel="JSON Input"
        outputLabel="Beautified Output"
        inputDot="var(--amber)"
        outputDot="var(--accent)"
        inputPlaceholder={'{"key":"value","nested":{"a":1}}'}
        inputValue={input}
        outputValue={outputText}
        outputHtml={outputHtml || undefined}
        onInputChange={setInput}
        onConvert={convert}
        onClear={() => { setInput(''); setOutputText(''); setOutputHtml(''); setValidation(null); setStats(null) }}
        onRandomExample={() => {
          const ex = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]
          setInput(ex.value)
          setTimeout(convert, 0)
        }}
        downloadFilename="fenaquery-beautified.json"
        minHeight={300}
      />

      {/* Status bar */}
      {(validation || stats) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px 24px',
          padding: '10px 16px', background: 'var(--surface-2)',
          border: `1px solid ${validation?.valid === false ? 'var(--red)' : 'var(--border)'}`,
          borderRadius: 10, fontFamily: 'var(--font-geist-mono)', fontSize: 10.5,
          flexWrap: 'wrap',
        }}>
          {validation && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: validation.valid ? 'var(--accent)' : 'var(--red)', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
              {validation.valid ? 'Valid JSON' : `Invalid: ${validation.error}`}
            </div>
          )}
          {stats && validation?.valid && (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text-3)' }}>Keys: <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{stats.keys}</span></span>
              <span style={{ color: 'var(--text-3)' }}>Depth: <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{stats.depth}</span></span>
              <span style={{ color: 'var(--text-3)' }}>Size: <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{stats.size}</span></span>
            </div>
          )}
        </div>
      )}

      <ExamplesGrid examples={EXAMPLES} onSelect={v => { setInput(v); setTimeout(convert, 0) }} />
    </ToolLayout>
  )
}

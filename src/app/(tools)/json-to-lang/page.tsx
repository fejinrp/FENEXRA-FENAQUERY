'use client'

import { useState, useCallback } from 'react'
import { ToolLayout } from '@/components/ui/ToolLayout'
import { EditorPanel } from '@/components/ui/EditorPanel'
import { ExamplesGrid } from '@/components/ui/ExamplesGrid'
import { jsonToPhp, jsonToPython, jsonToJs, jsonToDart, jsonToCSharp, jsonToGo } from '@/lib/tools/jsonToLang'
import { highlightJson, validateJson } from '@/lib/tools/jsonBeautifier'

const LANG_OPTIONS = [
  { id: 'php', label: 'PHP Array', ext: 'php' },
  { id: 'python', label: 'Python Dict', ext: 'py' },
  { id: 'js', label: 'JS Object', ext: 'js' },
  { id: 'dart', label: 'Dart Map', ext: 'dart' },
  { id: 'csharp', label: 'C# Dictionary', ext: 'cs' },
  { id: 'go', label: 'Golang Map', ext: 'go' },
] as const
type Lang = typeof LANG_OPTIONS[number]['id']

const EXAMPLES = [
  {
    label: 'Standard Object', tag: 'object', tagColor: '#2563eb',
    preview: '{"name": "John", "age": 30}',
    value: `{\n  "name": "John",\n  "age": 30,\n  "city": "New York",\n  "active": true,\n  "details": null\n}`,
  },
  {
    label: 'Nested Record List', tag: 'nested', tagColor: '#d97706',
    preview: '{"id": 1, "tags": ["a", "b"]}',
    value: `{\n  "id": 101,\n  "title": "Modern Web Development",\n  "tags": ["react", "nextjs", "tailwind"],\n  "author": {\n    "name": "Alice",\n    "active": true\n  }\n}`,
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

export default function JsonToLangPage() {
  const [lang, setLang] = useState<Lang>('php')
  const [input, setInput] = useState('')
  const [outputText, setOutputText] = useState('')
  const [outputHtml, setOutputHtml] = useState('')
  const [error, setError] = useState<string | null>(null)

  const convert = useCallback(() => {
    if (!input.trim()) return
    setError(null)
    try {
      const parsed = JSON.parse(input.trim())
      let result = ''
      
      if (lang === 'php') {
        result = jsonToPhp(parsed)
      } else if (lang === 'python') {
        result = jsonToPython(parsed)
      } else if (lang === 'js') {
        result = jsonToJs(parsed)
      } else if (lang === 'dart') {
        result = jsonToDart(parsed)
      } else if (lang === 'csharp') {
        result = jsonToCSharp(parsed)
      } else if (lang === 'go') {
        result = jsonToGo(parsed)
      }

      setOutputText(result)
      setOutputHtml(highlightJson(result))
    } catch (e) {
      setError((e as Error).message)
      setOutputText(`// Error: ${(e as Error).message}`)
      setOutputHtml(`<span class="syn-op">// Error: ${(e as Error).message}</span>`)
    }
  }, [input, lang])

  const selectedOpt = LANG_OPTIONS.find(o => o.id === lang)

  return (
    <ToolLayout
      title="JSON → Language Array / List"
      badge="NEW"
      controls={
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {LANG_OPTIONS.map(opt => (
            <button key={opt.id} style={btnStyle(lang === opt.id)} onClick={() => {
              setLang(opt.id)
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
        inputLabel="JSON Input"
        outputLabel={`${selectedOpt?.label || 'Formatted'} Output`}
        inputDot="var(--amber)"
        outputDot="var(--accent)"
        inputPlaceholder={'{"name": "John", "age": 30}'}
        inputValue={input}
        outputValue={outputText}
        outputHtml={outputHtml || undefined}
        onInputChange={setInput}
        onConvert={convert}
        onClear={() => { setInput(''); setOutputText(''); setOutputHtml(''); setError(null) }}
        onRandomExample={() => {
          const ex = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]
          setInput(ex.value)
          setTimeout(convert, 0)
        }}
        downloadFilename={`fenaquery-array.${selectedOpt?.ext || 'txt'}`}
        minHeight={300}
      />

      {error && (
        <div style={{
          padding: '10px 16px', background: 'var(--surface-2)',
          border: '1px solid var(--red)', borderRadius: 10,
          fontFamily: 'var(--font-geist-mono)', fontSize: 10.5,
          color: 'var(--red)', fontWeight: 600,
        }}>
          Invalid JSON Input: {error}
        </div>
      )}

      <ExamplesGrid examples={EXAMPLES} onSelect={v => { setInput(v); setTimeout(convert, 0) }} />
    </ToolLayout>
  )
}

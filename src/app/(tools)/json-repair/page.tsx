'use client'

import { useState, useCallback } from 'react'
import { ToolLayout } from '@/components/ui/ToolLayout'
import { EditorPanel } from '@/components/ui/EditorPanel'
import { ExamplesGrid } from '@/components/ui/ExamplesGrid'
import { repairJson } from '@/lib/tools/jsonRepair'
import { highlightJson, validateJson, getJsonStats } from '@/lib/tools/jsonBeautifier'

const EXAMPLES = [
  {
    label: 'Single Quotes & Trailing Commas', tag: 'mixed', tagColor: '#d97706',
    preview: "{'name': 'FenaQuery', 'status': 'live',}",
    value: `{\n  'name': 'FenaQuery',\n  'status': 'live',\n  'features': [\n    'repair',\n    'beautify',\n  ],\n}`,
  },
  {
    label: 'Unquoted Keys & Comments', tag: 'unquoted', tagColor: '#7c3aed',
    preview: '{ id: 101, title: "Modern Web" }',
    value: `{\n  // User ID\n  id: 101,\n  /* Project title */\n  title: "Modern Web",\n  tags: ["react", "nextjs"]\n}`,
  },
  {
    label: 'Python Values & Undefined', tag: 'python-js', tagColor: '#2563eb',
    preview: "{'active': True, 'data': None}",
    value: `{\n  'active': True,\n  'data': None,\n  'config': undefined\n}`,
  },
  {
    label: 'Truncated / Unclosed Brackets', tag: 'truncated', tagColor: '#dc2626',
    preview: '[{"id": 1}, {"id": 2',
    value: `[\n  {"id": 1},\n  {"id": 2`,
  },
]

export default function JsonRepairPage() {
  const [input, setInput] = useState('')
  const [outputText, setOutputText] = useState('')
  const [outputHtml, setOutputHtml] = useState('')
  const [repaired, setRepaired] = useState<boolean | null>(null)
  const [stats, setStats] = useState<{ keys: number; depth: number; size: string } | null>(null)

  const convert = useCallback(() => {
    if (!input.trim()) return
    try {
      const repairedCode = repairJson(input.trim())
      
      // Validate the repaired output
      const validation = validateJson(repairedCode)
      if (validation.valid) {
        setOutputText(repairedCode)
        setOutputHtml(highlightJson(repairedCode))
        setStats(getJsonStats(repairedCode))
        setRepaired(true)
      } else {
        setOutputText(`// Unable to repair completely. Current attempt:\n${repairedCode}\n\n// Error:\n// ${validation.error}`)
        setOutputHtml(`<span class="syn-op">// Unable to repair completely. Current attempt:\n${repairedCode}\n\n// Error:\n// ${validation.error}</span>`)
        setRepaired(false)
        setStats(null)
      }
    } catch (e) {
      setOutputText(`// Error: ${(e as Error).message}`)
      setOutputHtml(`<span class="syn-op">// Error: ${(e as Error).message}</span>`)
      setRepaired(false)
      setStats(null)
    }
  }, [input])

  return (
    <ToolLayout
      title="JSON Repair & Auto-Fixer"
      badge="NEW"
    >
      <EditorPanel
        inputLabel="Broken / Messy JSON"
        outputLabel="Repaired Valid JSON"
        inputDot="var(--red)"
        outputDot="var(--accent)"
        inputPlaceholder={`{\n  id: 101,\n  'name': 'FenaQuery',\n  tags: ['utility', 'tool',],\n}`}
        inputValue={input}
        outputValue={outputText}
        outputHtml={outputHtml || undefined}
        onInputChange={setInput}
        onConvert={convert}
        onClear={() => { setInput(''); setOutputText(''); setOutputHtml(''); setRepaired(null); setStats(null) }}
        onRandomExample={() => {
          const ex = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]
          setInput(ex.value)
          setTimeout(convert, 0)
        }}
        downloadFilename="fenaquery-repaired.json"
        minHeight={320}
      />

      {/* Status Bar */}
      {(repaired !== null || stats) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px 24px',
          padding: '10px 16px', background: 'var(--surface-2)',
          border: `1px solid ${repaired === false ? 'var(--red)' : 'var(--border)'}`,
          borderRadius: 10, fontFamily: 'var(--font-geist-mono)', fontSize: 10.5,
          flexWrap: 'wrap',
        }}>
          {repaired !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: repaired ? 'var(--accent)' : 'var(--red)', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
              {repaired ? 'Successfully Repaired & Validated!' : 'Repair Attempt Incomplete'}
            </div>
          )}
          {stats && repaired && (
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

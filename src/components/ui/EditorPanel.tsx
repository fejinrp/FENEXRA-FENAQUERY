'use client'

import { ReactNode, useCallback, useState } from 'react'
import { Copy, Download, Trash2, Shuffle } from 'lucide-react'

interface EditorPanelProps {
  inputLabel?: string
  outputLabel?: string
  inputDot?: string
  outputDot?: string
  inputPlaceholder?: string
  inputValue: string
  outputValue: string
  onInputChange: (v: string) => void
  onConvert: () => void
  onClear?: () => void
  onRandomExample?: () => void
  outputHtml?: string
  convertLabel?: string
  minHeight?: number
  downloadFilename?: string
  children?: ReactNode
}

export function EditorPanel({
  inputLabel = 'Input',
  outputLabel = 'Output',
  inputDot = '#5eaeff',
  outputDot = '#00c87a',
  inputPlaceholder = '',
  inputValue,
  outputValue,
  onInputChange,
  onConvert,
  onClear,
  onRandomExample,
  outputHtml,
  convertLabel = 'RUN',
  minHeight = 280,
  downloadFilename = 'fenaquery-output.txt',
}: EditorPanelProps) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(outputValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [outputValue])

  const download = useCallback(() => {
    const blob = new Blob([outputValue], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = downloadFilename
    a.click()
  }, [outputValue, downloadFilename])

  const btnStyle = {
    background: 'var(--surface-3)',
    border: '1px solid var(--border)',
    color: 'var(--text-2)',
    borderRadius: 6,
    padding: '3px 9px',
    fontSize: 11,
    cursor: 'pointer',
    fontFamily: 'var(--font-geist-mono)',
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  } as const

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '9px 14px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface-2)',
    flexShrink: 0,
  } as const

  const labelStyle = {
    fontFamily: 'var(--font-geist-mono)',
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--text-2)',
    letterSpacing: '1.2px',
    textTransform: 'uppercase' as const,
    display: 'flex',
    alignItems: 'center',
    gap: 7,
  }

  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result
      if (typeof text === 'string') {
        onInputChange(text)
      }
    }
    reader.readAsText(file)
  }, [onInputChange])

  return (
    <div
      className="editor-panel-container"
      style={{
        display: 'flex',
        flexDirection: 'row',
        border: '1px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
        background: 'var(--surface)',
        minHeight,
      }}
    >
      <style jsx>{`
        .editor-panel-container {
          flex-direction: row;
        }
        .pane {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          position: relative;
        }
        .drag-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 200, 122, 0.08);
          border: 2px dashed var(--accent);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-geist-mono);
          font-size: 13px;
          font-weight: 600;
          color: var(--accent);
          backdrop-filter: blur(2px);
          z-index: 10;
          pointer-events: none;
          transition: all 0.15s ease-in-out;
        }
        .convert-spacer {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-left: 1px solid var(--border);
          border-right: 1px solid var(--border);
          background: var(--surface-2);
          width: 52px;
          flex-shrink: 0;
        }
        @media (max-width: 768px) {
          .editor-panel-container {
            flex-direction: column !important;
            min-height: auto !important;
          }
          .convert-spacer {
            width: 100% !important;
            height: 60px !important;
            border-left: none !important;
            border-right: none !important;
            border-top: 1px solid var(--border);
            border-bottom: 1px solid var(--border);
          }
          .convert-btn {
            width: 80% !important;
            height: 40px !important;
            flex-direction: row !important;
            gap: 10px !important;
          }
          .convert-btn span:first-child {
            transform: rotate(90deg);
          }
        }
      `}</style>

      {/* Input pane */}
      <div 
        className="pane"
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          const file = e.dataTransfer.files?.[0]
          if (file) handleFileUpload(file)
        }}
      >
        {isDragging && <div className="drag-overlay">Drop your file here to load...</div>}
        <div style={headerStyle}>
          <div style={labelStyle}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: inputDot, display: 'inline-block' }} />
            {inputLabel}
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            <label style={{ ...btnStyle, cursor: 'pointer' }} title="Load from file">
              <Download size={10} style={{ transform: 'rotate(180deg)' }} />
              upload
              <input
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
              />
            </label>
            {onRandomExample && (
              <button style={btnStyle} onClick={onRandomExample} title="Load random example">
                <Shuffle size={10} />
                example
              </button>
            )}
            {onClear && (
              <button style={btnStyle} onClick={onClear} title="Clear input">
                <Trash2 size={10} />
                clear
              </button>
            )}
          </div>
        </div>
        <textarea
          className="code-textarea"
          style={{ flex: 1, minHeight: minHeight / 2 }}
          value={inputValue}
          onChange={e => onInputChange(e.target.value)}
          placeholder={inputPlaceholder}
          onKeyDown={e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault()
              onConvert()
            }
          }}
        />
      </div>

      {/* Convert button */}
      <div className="convert-spacer">
        <button
          className="convert-btn"
          onClick={onConvert}
          title={`Convert (Ctrl+Enter)`}
          style={{
            width: 38,
            height: 76,
            borderRadius: 10,
            background: 'var(--accent)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            transition: 'all 0.2s',
            boxShadow: '0 2px 12px rgba(0,195,122,0.25)',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
          }}
        >
          <span style={{ fontSize: 16, color: '#fff', fontWeight: 700, lineHeight: 1 }}>→</span>
          <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 7.5, color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            {convertLabel}
          </span>
        </button>
      </div>

      {/* Output pane */}
      <div className="pane">
        <div style={headerStyle}>
          <div style={labelStyle}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: outputDot, display: 'inline-block' }} />
            {outputLabel}
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            <button style={btnStyle} onClick={copy}>
              <Copy size={10} />
              {copied ? 'copied!' : 'copy'}
            </button>
            <button style={btnStyle} onClick={download}>
              <Download size={10} />
              save
            </button>
          </div>
        </div>
        {outputHtml ? (
          <div
            className="code-textarea"
            style={{ flex: 1, minHeight: minHeight / 2, overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
            dangerouslySetInnerHTML={{ __html: outputHtml }}
          />
        ) : (
          <div
            className="code-textarea"
            style={{ flex: 1, minHeight: minHeight / 2, overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: outputValue ? 'var(--text)' : 'var(--text-3)' }}
          >
            {outputValue || '// output will appear here'}
          </div>
        )}
      </div>
    </div>
  )
}


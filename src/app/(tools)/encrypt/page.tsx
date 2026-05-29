'use client'

import { useState, useCallback } from 'react'
import { ToolLayout } from '@/components/ui/ToolLayout'
import { encryptText, decryptText, ENC_MODES, EncMode } from '@/lib/tools/encrypt'

export default function EncryptPage() {
  const [mode, setMode] = useState<EncMode>('AES-GCM-256')
  const [input, setInput] = useState('')
  const [password, setPassword] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentMode = ENC_MODES.find(m => m.value === mode)!

  const run = useCallback(async (action: 'encrypt' | 'decrypt') => {
    if (!input.trim()) return
    if (currentMode.needsKey && !password.trim()) { setError('A password/key is required for this mode.'); return }
    setLoading(true); setError(''); setOutput('')
    try {
      const result = action === 'encrypt'
        ? await encryptText(input.trim(), password, mode)
        : await decryptText(input.trim(), password, mode)
      setOutput(result)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [input, password, mode, currentMode])

  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const cardStyle = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 14, overflow: 'hidden',
  }

  const headerStyle = {
    padding: '9px 14px', background: 'var(--surface-2)',
    borderBottom: '1px solid var(--border)',
    fontFamily: 'var(--font-geist-mono)', fontSize: 10,
    fontWeight: 700, color: 'var(--text-2)',
    letterSpacing: '1.2px', textTransform: 'uppercase' as const,
    display: 'flex', alignItems: 'center', gap: 7,
  }

  const inputStyle = {
    width: '100%', padding: '14px', background: 'var(--surface)',
    border: 'none', outline: 'none', color: 'var(--text)',
    fontFamily: 'var(--font-geist-mono)', fontSize: 12.5, lineHeight: 1.75,
    resize: 'none' as const,
  }

  const modeBtn = (m: typeof ENC_MODES[0]) => ({
    padding: '8px 14px',
    borderRadius: 9,
    border: `1px solid ${mode === m.value ? 'var(--accent)' : 'var(--border)'}`,
    background: mode === m.value ? 'var(--accent-bg)' : 'var(--surface)',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.15s',
  })

  const actionBtn = (color: string) => ({
    flex: 1, padding: '12px 20px', borderRadius: 9,
    background: color, border: 'none', cursor: loading ? 'wait' : 'pointer',
    fontFamily: 'var(--font-geist-sans)', fontSize: 13, fontWeight: 700,
    color: color === 'var(--accent)' ? '#0a1a10' : '#fff',
    transition: 'all 0.15s', opacity: loading ? 0.7 : 1,
  })

  return (
    <ToolLayout title="Encrypt / Decrypt" badge="LIVE" subtitle="100% client-side · Web Crypto API · zero data transmitted">
      <div
        style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}
        className="encrypt-grid"
      >
        <style jsx>{`
          @media (max-width: 800px) {
            .encrypt-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        {/* Mode selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '1.8px', textTransform: 'uppercase', marginBottom: 4 }}>
            Algorithm
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ENC_MODES.map(m => (
              <button key={m.value} style={modeBtn(m)} onClick={() => setMode(m.value)}>
                <div style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, fontWeight: 700, color: mode === m.value ? 'var(--accent)' : 'var(--text)', marginBottom: 2 }}>
                  {m.label}
                </div>
                <div style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 9.5, color: 'var(--text-3)', lineHeight: 1.4 }}>
                  {m.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Input */}
          <div style={cardStyle} className="premium-card">
            <div style={headerStyle}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--blue)', display: 'inline-block' }} />
              Input Text
            </div>
            <textarea
              style={{ ...inputStyle, minHeight: 140 }}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter text to encrypt or ciphertext to decrypt..."
            />
          </div>

          {/* Password */}
          {currentMode.needsKey && (
            <div style={cardStyle} className="premium-card">
              <div style={headerStyle}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--purple)', display: 'inline-block' }} />
                Password / Key
              </div>
              <input
                type="password"
                style={{ ...inputStyle, padding: '12px 14px' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter encryption key / password..."
              />
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={actionBtn('var(--accent)')} onClick={() => run('encrypt')} disabled={loading}>
              {loading ? '...' : '🔒 Encrypt'}
            </button>
            <button style={actionBtn('var(--surface-3)')} onClick={() => run('decrypt')} disabled={loading}>
              {loading ? '...' : '🔓 Decrypt'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(220,38,38,0.1)', border: '1px solid var(--red)', borderRadius: 10, fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--red)' }}>
              {error}
            </div>
          )}

          {/* Output */}
          {output && (
            <div style={cardStyle} className="premium-card">
              <div style={{ ...headerStyle, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                  Output
                </div>
                <button
                  onClick={copy}
                  style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: copied ? 'var(--accent)' : 'var(--text-2)', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-geist-mono)', fontWeight: 600 }}
                >
                  {copied ? 'copied!' : '⎘ copy'}
                </button>
              </div>
              <div style={{ ...inputStyle, display: 'block', minHeight: 100, whiteSpace: 'pre-wrap', wordBreak: 'break-all', userSelect: 'text', padding: '16px' }}>
                {output}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}

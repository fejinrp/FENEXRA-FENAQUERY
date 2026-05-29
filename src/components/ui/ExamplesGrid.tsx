'use client'

interface Example {
  label: string
  tag: string
  tagColor: string
  preview: string
  value: string
}

interface ExamplesGridProps {
  examples: Example[]
  onSelect: (value: string) => void
}

export function ExamplesGrid({ examples, onSelect }: ExamplesGridProps) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--text-3)',
          letterSpacing: '1.8px',
          textTransform: 'uppercase',
          marginBottom: 9,
        }}
      >
        Quick Examples
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 7,
        }}
      >
        {examples.map(ex => (
          <button
            key={ex.label}
            onClick={() => onSelect(ex.value)}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 9,
              padding: '11px 13px',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--accent)'
              el.style.background = 'var(--accent-bg)'
              el.querySelector('.ex-title')!.setAttribute('style', 'color: var(--accent); font-family: var(--font-geist-mono); font-size: 12px; font-weight: 700;')
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--border)'
              el.style.background = 'var(--surface)'
              el.querySelector('.ex-title')!.setAttribute('style', 'color: var(--text); font-family: var(--font-geist-mono); font-size: 12px; font-weight: 700;')
            }}
          >
            <span
              className="ex-title"
              style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, fontWeight: 700, color: 'var(--text)', transition: 'color 0.15s' }}
            >
              {ex.label}
            </span>
            <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {ex.preview}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: 9,
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 4,
                width: 'fit-content',
                background: ex.tagColor + '18',
                color: ex.tagColor,
              }}
            >
              {ex.tag}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

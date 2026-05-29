'use client'

import { ReactNode } from 'react'

interface ToolLayoutProps {
  title: string
  subtitle?: string
  badge?: string
  controls?: ReactNode
  children: ReactNode
}

export function ToolLayout({
  title,
  subtitle = 'all processing is client-side · no data stored',
  badge,
  controls,
  children,
}: ToolLayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, minWidth: 0 }}>
      {/* Top bar */}
      <div
        style={{
          padding: '12px 18px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap',
          minHeight: 56,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span
            style={{
              fontFamily: 'var(--font-geist-sans)',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '-0.2px',
            }}
          >
            {title}
          </span>
          {badge && (
            <span
              style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: 8.5,
                fontWeight: 700,
                letterSpacing: '0.5px',
                padding: '2px 7px',
                borderRadius: 4,
                background: 'var(--accent-bg)',
                color: 'var(--accent)',
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {controls}
        </div>

        <span
          style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10.5,
            color: 'var(--text-3)',
            marginLeft: 'auto',
          }}
          className="hide-mobile"
        >
          {subtitle}
        </span>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          overflowY: 'auto',
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  )
}

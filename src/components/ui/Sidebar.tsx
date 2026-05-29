'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import {
  ArrowLeftRight, Braces, Table2, Lock,
  FileJson, Minimize2, Code2, Sun, Moon, Menu, X, Wrench, Brackets, Eye
} from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  {
    section: 'Converters',
    items: [
      { href: '/sql-to-mongo', icon: ArrowLeftRight, label: 'SQL → MongoDB', live: true },
      { href: '/json-to-types', icon: Braces, label: 'JSON → Types', live: true },
      { href: '/json-to-sql', icon: Table2, label: 'JSON → SQL', live: true },
      { href: '/json-to-lang', icon: Brackets, label: 'JSON → Array/List', live: true },
      { href: '/sql-visualizer', icon: Eye, label: 'SQL Visualizer', live: true },
    ],
  },
  {
    section: 'Utilities',
    items: [
      { href: '/json-beautifier', icon: FileJson, label: 'JSON Beautifier', live: true },
      { href: '/json-minifier', icon: Minimize2, label: 'JSON Minifier', live: true },
      { href: '/json-repair', icon: Wrench, label: 'JSON Repair', live: true },
    ],
  },
  {
    section: 'Web (Soon)',
    items: [
      { href: '/web-tools', icon: Code2, label: 'HTML / CSS / JS', live: false },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  // Close sidebar on navigation
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 100,
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        className="mobile-toggle"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
        />
      )}

      <nav
        style={{
          width: 224,
          minWidth: 224,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          zIndex: 95,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className={clsx('sidebar-nav', isOpen && 'sidebar-open')}
      >
        <style jsx>{`
          @media (max-width: 1024px) {
            .sidebar-nav {
              position: fixed !important;
              transform: translateX(-100%);
            }
            .sidebar-open {
              transform: translateX(0);
            }
            .mobile-toggle {
              display: flex !important;
            }
          }
        `}</style>

        {/* Logo */}
        <div style={{ padding: '22px 18px 16px', borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div
              style={{
                fontFamily: 'var(--font-geist-sans)',
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: '-0.6px',
                lineHeight: 1,
              }}
            >
              <span style={{ color: 'var(--accent)' }}>Fena</span>
              <span style={{ color: 'var(--text)' }}>Query</span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: 9.5,
                color: 'var(--text-3)',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginTop: 5,
              }}
            >
              by FENAXRA
            </div>
          </Link>
        </div>

        {/* Nav sections */}
        <div style={{ flex: 1, padding: '8px 10px' }}>
          {NAV.map(({ section, items }) => (
            <div key={section} style={{ marginTop: 12 }}>
              <div
                style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: 9,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--text-3)',
                  padding: '0 8px',
                  marginBottom: 4,
                }}
              >
                {section}
              </div>
              {items.map(({ href, icon: Icon, label, live }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={live ? href : '#'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 12px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: 'var(--font-geist-sans)',
                      textDecoration: 'none',
                      color: active ? 'var(--accent)' : 'var(--text-2)',
                      background: active ? 'var(--accent-bg)' : 'transparent',
                      position: 'relative',
                      transition: 'all 0.15s',
                      cursor: live ? 'pointer' : 'default',
                      opacity: live ? 1 : 0.5,
                    }}
                    className={clsx('nav-item', active && 'nav-item-active')}
                  >
                    {active && (
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '22%',
                          bottom: '22%',
                          width: 2.5,
                          background: 'var(--accent)',
                          borderRadius: 2,
                        }}
                      />
                    )}
                    <Icon size={15} strokeWidth={2} />
                    <span style={{ flex: 1 }}>{label}</span>
                    {live && (
                      <span
                        style={{
                          fontFamily: 'var(--font-geist-mono)',
                          fontSize: 8.5,
                          fontWeight: 700,
                          letterSpacing: '0.5px',
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: 'var(--accent-bg)',
                          color: 'var(--accent)',
                        }}
                      >
                        LIVE
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 9.5,
              color: 'var(--text-3)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            © <span style={{ color: 'var(--purple)' }}>FENAXRA</span>
          </span>
          <button
            onClick={toggle}
            title="Toggle theme"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-2)',
              transition: 'all 0.15s',
            }}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </nav>
    </>
  )
}

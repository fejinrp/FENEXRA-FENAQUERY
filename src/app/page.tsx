'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, ArrowLeftRight, Braces, Table2,
  Lock, FileJson, Minimize2, Code2,
  Shield, Zap, Globe, Menu, X, Wrench, Brackets, Eye
} from 'lucide-react'

/* ── data ─────────────────────────────────────────── */
const TOOLS = [
  {
    href: '/sql-to-mongo',
    icon: ArrowLeftRight,
    label: 'SQL → MongoDB',
    desc: 'Convert SELECT, INSERT, UPDATE, DELETE + JOINs to MongoDB aggregation pipelines.',
    accent: '#00c87a',
    dim: 'rgba(0,200,122,0.12)',
  },
  {
    href: '/json-to-types',
    icon: Braces,
    label: 'JSON → Types',
    desc: 'Generate TypeScript, C#, Python, and Go type definitions from JSON samples.',
    accent: '#a78bfa',
    dim: 'rgba(167,139,250,0.12)',
  },
  {
    href: '/json-to-sql',
    icon: Table2,
    label: 'JSON → SQL',
    desc: 'Create INSERT statements for MSSQL, MySQL, and PostgreSQL from JSON data.',
    accent: '#5eaeff',
    dim: 'rgba(94,174,255,0.12)',
  },
  {
    href: '/encrypt',
    icon: Lock,
    label: 'Encrypt / Decrypt',
    desc: 'AES-GCM-256, AES-CBC, Base64, ROT13 — powered by the Web Crypto API.',
    accent: '#ffb84d',
    dim: 'rgba(255,184,77,0.12)',
  },
  {
    href: '/json-beautifier',
    icon: FileJson,
    label: 'JSON Beautifier',
    desc: 'Pretty-print and validate JSON with real-time statistics and depth analysis.',
    accent: '#ff6b6b',
    dim: 'rgba(255,107,107,0.12)',
  },
  {
    href: '/json-minifier',
    icon: Minimize2,
    label: 'JSON Minifier',
    desc: 'Compact JSON output to reduce payload size for production and APIs.',
    accent: '#00c87a',
    dim: 'rgba(0,200,122,0.12)',
  },
  {
    href: '/json-repair',
    icon: Wrench,
    label: 'JSON Repair',
    desc: 'Instantly repair broken JSON: auto-fixes single quotes, trailing commas, comments, and missing brackets.',
    accent: '#a78bfa',
    dim: 'rgba(167,139,250,0.12)',
  },
  {
    href: '/json-to-lang',
    icon: Brackets,
    label: 'JSON → Array/List',
    desc: 'Instantly convert JSON objects into native, formatted array or list representations for PHP, Python, JS, and Dart.',
    accent: '#5eaeff',
    dim: 'rgba(94,174,255,0.12)',
  },
  {
    href: '/sql-visualizer',
    icon: Eye,
    label: 'SQL Visualizer',
    desc: 'Instantly visualize SQL Stored Procedures: maps variables, referenced tables, and execution step flowcharts.',
    accent: '#ff6b6b',
    dim: 'rgba(255,107,107,0.12)',
  },
]

const STATS = [
  { value: '100%', label: 'Client-Side', icon: Shield, desc: 'Runs entirely in your browser'  },
  { value: '0',    label: 'Data Sent',   icon: Globe,  desc: 'Nothing leaves your machine'    },
  { value: '6+',   label: 'Free Tools',  icon: Zap,    desc: 'No signup, no limits ever'      },
]

/* ── landing page ──────────────────────────────────── */
export default function LandingPage() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.sr')
    const fallback = setTimeout(() => {
      els.forEach(el => el.classList.add('sr-in'))
    }, 1500)

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            el.classList.add('sr-in')
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.08 }
    )

    els.forEach(el => observer.observe(el))
    return () => { clearTimeout(fallback); observer.disconnect() }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b0d12',
      color: '#eef0f8',
      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
      position: 'relative',
      overflowX: 'hidden',
    }}>

      {/* ── dot grid ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.038) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }} />

      {/* ── hero glow ── */}
      <div className="lp-orb1" style={{
        position: 'fixed', top: '-15%', left: '50%',
        width: 900, height: 560, borderRadius: '50%',
        pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse, rgba(0,200,122,0.15) 0%, transparent 68%)',
        transformOrigin: 'center center',
      }} />

      {/* ════════ NAVBAR ════════ */}
      <header className="glass" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300,
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 20px',
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.8px', lineHeight: 1 }}>
              <span style={{ color: '#00c87a' }}>Fena</span>
              <span style={{ color: '#eef0f8' }}>Query</span>
            </div>
            <div style={{ fontFamily: 'var(--font-geist-mono),monospace', fontSize: 9, color: 'var(--text-3)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: 4 }}>
              by FENAXRA
            </div>
          </Link>

          {/* desktop links */}
          <nav className="lp-desktop-nav" style={{ display: 'flex', gap: 8 }}>
            {TOOLS.map(t => (
              <Link key={t.href} href={t.href} className="lp-nav-link" style={{
                fontSize: 13, fontWeight: 600, color: '#94a3b8',
                textDecoration: 'none', padding: '6px 12px', borderRadius: 8,
                transition: 'all 0.2s',
              }}>
                {t.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/sql-to-mongo" className="hide-mobile" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 24px', borderRadius: 10,
              background: '#00c87a', color: '#000',
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(0,200,122,0.3)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}>
              Launch App
            </Link>

            {/* hamburger */}
            <button onClick={() => setOpen(v => !v)} className="lp-hamburger" style={{
              display: 'none', background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 8, width: 40, height: 40,
              cursor: 'pointer', color: '#94a3b8',
              alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* mobile drawer */}
        {open && (
          <div className="glass" style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {TOOLS.map(t => (
              <Link key={t.href} href={t.href} onClick={() => setOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 10,
                fontSize: 15, fontWeight: 600, color: '#eef0f8',
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <t.icon size={18} strokeWidth={2} style={{ color: t.accent }} />
                {t.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <style jsx>{`
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>

      {/* ════════ HERO ════════ */}
      <section style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        padding: '120px 20px 80px',
        maxWidth: 1200, margin: '0 auto',
      }}>
        <div className="lp-hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 80,
          alignItems: 'center',
          width: '100%',
        }}>

          {/* ── left: text ── */}
          <div style={{ textAlign: 'left' }}>
            <div className="lp-badge" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 99,
              border: '1px solid rgba(0,200,122,0.3)',
              background: 'rgba(0,200,122,0.1)',
              marginBottom: 32,
            }}>
              <span className="animate-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#00c87a', boxShadow: '0 0 12px #00c87a' }} />
              <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, fontWeight: 700, color: '#00c87a', letterSpacing: '0.05em' }}>
                PRIVATE · SECURE · CLIENT-SIDE
              </span>
            </div>

            <h1 style={{
              fontWeight: 900, lineHeight: 1,
              letterSpacing: '-0.04em',
              fontSize: 'clamp(40px, 6vw, 84px)',
              marginBottom: 24,
            }}>
              <span className="lp-line1" style={{ display: 'block', color: '#fff' }}>Power Tools</span>
              <span className="lp-line2" style={{ display: 'block', color: 'rgba(255,255,255,0.7)' }}>For Modern</span>
              <span className="lp-line3" style={{
                display: 'block',
                background: 'linear-gradient(135deg, #00c87a 0%, #5eaeff 50%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Developers.</span>
            </h1>

            <p className="lp-sub" style={{
              fontSize: 'clamp(16px, 1.8vw, 19px)',
              color: '#94a3b8',
              lineHeight: 1.6,
              maxWidth: 540,
              marginBottom: 40,
            }}>
              Convert, transform, and beautify your data with professional tools running entirely in your browser. No server, no logs, 100% private.
            </p>

            <div className="lp-cta" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/sql-to-mongo" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '16px 36px', borderRadius: 12,
                background: '#00c87a', color: '#000',
                fontWeight: 800, fontSize: 16, textDecoration: 'none',
                boxShadow: '0 8px 30px rgba(0,200,122,0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,200,122,0.45)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,200,122,0.3)'
                }}
              >
                Explore Tools <ArrowRight size={18} />
              </Link>
              <a href="#tools" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '16px 36px', borderRadius: 12,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none',
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'
                }}
              >
                Browse All
              </a>
            </div>
          </div>

          {/* ── right: card ── */}
          <div className="lp-card lp-code-card" style={{
            background: '#0f172a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5), 0 30px 60px -30px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)',
          }}>
            <div style={{ padding: '16px 20px', background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: '#64748b', marginLeft: 8 }}>fenaquery-demo.sql</span>
            </div>
            <div style={{ padding: '24px' }}>
              <pre style={{ margin: 0, fontFamily: 'var(--font-geist-mono)', fontSize: 14, lineHeight: 1.6, color: '#94a3b8' }}>
                <span style={{ color: '#00c87a' }}>SELECT</span> name, email, role{'\n'}
                <span style={{ color: '#00c87a' }}>FROM</span> users{'\n'}
                <span style={{ color: '#00c87a' }}>WHERE</span> status = <span style={{ color: '#5eaeff' }}>'active'</span>{'\n'}
                <span style={{ color: '#00c87a' }}>LIMIT</span> <span style={{ color: '#ffb84d' }}>10</span>;
              </pre>
              <div style={{ margin: '20px 0', height: 1, background: 'rgba(255,255,255,0.05)' }} />
              <pre style={{ margin: 0, fontFamily: 'var(--font-geist-mono)', fontSize: 14, lineHeight: 1.6, color: '#94a3b8' }}>
                <span style={{ color: '#a78bfa' }}>db</span>.users.<span style={{ color: '#00c87a' }}>find</span>({'{'}{'\n'}
                {'  '}status: <span style={{ color: '#5eaeff' }}>'active'</span>{'\n'}
                {'}'}).<span style={{ color: '#00c87a' }}>limit</span>(<span style={{ color: '#ffb84d' }}>10</span>)
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ TOOLS GRID ════════ */}
      <section id="tools" style={{
        position: 'relative', zIndex: 1,
        padding: '100px 20px',
        maxWidth: 1200, margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 70 }}>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, color: '#fff', marginBottom: 16 }}>
            The Developer <span style={{ color: '#00c87a' }}>Toolkit</span>
          </h2>
          <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 600, margin: '0 auto' }}>
            A suite of professional conversion and utility tools designed to speed up your daily workflow.
          </p>
        </div>

        <div className="lp-tools-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
        }}>
          {TOOLS.map((t, i) => (
            <Link key={t.href} href={t.href} className="sr premium-card glass" style={{
              transitionDelay: `${i * 0.1}s`,
              display: 'flex', flexDirection: 'column', gap: 20,
              padding: '32px', borderRadius: 24,
              textDecoration: 'none',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: t.dim,
                border: `1px solid ${t.accent}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <t.icon size={24} style={{ color: t.accent }} strokeWidth={2} />
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{t.label}</h3>
                <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: t.accent }}>
                Open Tool <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════ STATS ════════ */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '100px 20px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(15,23,42,0.5)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="lp-stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
          }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="sr" style={{ transitionDelay: `${i * 0.15}s`, textAlign: 'center' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 16,
                  background: 'rgba(0,200,122,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px', color: '#00c87a'
                }}>
                  <s.icon size={28} strokeWidth={1.5} />
                </div>
                <div style={{ fontSize: 44, fontWeight: 900, color: '#fff', marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#eef0f8', marginBottom: 8 }}>{s.label}</div>
                <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer style={{
        position: 'relative', zIndex: 1,
        padding: '40px 20px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20,
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px' }}>
              <span style={{ color: '#00c87a' }}>Fena</span>
              <span style={{ color: '#eef0f8' }}>Query</span>
            </div>
            <div style={{
              fontFamily: 'var(--font-geist-mono),monospace',
              fontSize: 10, color: '#475569',
              letterSpacing: '2px', textTransform: 'uppercase', marginTop: 4,
            }}>
              by <span style={{ color: '#a78bfa' }}>FENAXRA</span>
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-geist-mono),monospace',
            fontSize: 12, color: '#475569',
          }}>
            © {new Date().getFullYear()} FENAXRA · All rights reserved
          </div>
        </div>
      </footer>
    </div>
  )
}

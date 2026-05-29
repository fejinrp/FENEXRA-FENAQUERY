import { ToolLayout } from '@/components/ui/ToolLayout'

export default function WebToolsPage() {
  const tools = [
    { name: 'HTML Minifier', desc: 'Strip whitespace and comments from HTML files for production.' },
    { name: 'HTML Beautifier', desc: 'Format messy HTML into clean, indented markup.' },
    { name: 'CSS Minifier', desc: 'Compress stylesheets — removes spaces, comments, and redundancy.' },
    { name: 'CSS Beautifier', desc: 'Auto-format and prettify CSS with consistent indentation.' },
    { name: 'JS Minifier', desc: 'Minify JavaScript for smaller bundle sizes.' },
    { name: 'JS Beautifier', desc: 'Unminify and format JavaScript code.' },
  ]

  return (
    <ToolLayout title="Web Tools" subtitle="Coming in the next FenaQuery release">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginTop: 8 }}>
        {tools.map(t => (
          <div key={t.name} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px', opacity: 0.6 }}>
            <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{t.name}</div>
            <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>{t.desc}</div>
            <span style={{ display: 'inline-block', marginTop: 12, fontFamily: 'var(--font-geist-mono)', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'var(--surface-3)', color: 'var(--text-3)', letterSpacing: '0.5px' }}>SOON</span>
          </div>
        ))}
      </div>
    </ToolLayout>
  )
}

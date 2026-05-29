'use client'

import { useState, useCallback, useEffect } from 'react'
import { ToolLayout } from '@/components/ui/ToolLayout'
import { ExamplesGrid } from '@/components/ui/ExamplesGrid'
import { parseStoredProcedure, SQLProcedureReport, SQLFlowStep } from '@/lib/tools/procedureParser'
import { GitBranch, RefreshCw, Shield, Database, Play, Trash2, Shuffle, Code2, Columns } from 'lucide-react'

const EXAMPLES = [
  {
    label: 'T-SQL Procedure (MSSQL)', tag: 'mssql', tagColor: '#5eaeff',
    preview: 'CREATE PROCEDURE GetUserSummary...',
    value: `CREATE PROCEDURE GetUserSummary (
    @UserId INT,
    @IncludeLogs BIT = 0
) AS
BEGIN
    -- Check user active status
    SELECT status, email FROM users WHERE id = @UserId;
    
    BEGIN TRANSACTION;
    
    UPDATE users SET last_login = GETDATE() WHERE id = @UserId;
    
    IF @IncludeLogs = 1
    BEGIN
        SELECT * FROM logs WHERE user_id = @UserId ORDER BY created_at DESC;
    END
    
    COMMIT TRANSACTION;
END`
  },
  {
    label: 'PostgreSQL Procedure', tag: 'postgres', tagColor: '#a78bfa',
    preview: 'CREATE OR REPLACE FUNCTION ProcessPayment...',
    value: `CREATE OR REPLACE FUNCTION ProcessPayment(
    IN paymentId INT,
    IN amount NUMERIC,
    OUT status VARCHAR(20)
) RETURNS VARCHAR(20) LANGUAGE plpgsql AS $$
BEGIN
    SELECT active FROM accounts WHERE id = paymentId;
    
    IF amount > 1000 THEN
        UPDATE payments SET approved = false WHERE id = paymentId;
        status := 'pending_review';
    ELSE
        INSERT INTO audit_logs (ref_id, message) VALUES (paymentId, 'Approved auto');
        status := 'approved';
    END IF;
END;
$$`
  },
  {
    label: 'T-SQL Exec Script', tag: 'exec', tagColor: '#ff6b6b',
    preview: 'DECLARE @NewOrderTrackingNumber INT...',
    value: `-- Create tracking memory variables to hold returned info
DECLARE @NewOrderTrackingNumber INT;
DECLARE @OperationStatusFeedback NVARCHAR(250);

-- Run the procedure with sample values
EXEC dbo.usp_ProcessCustomerOrder
    @CustomerID = 1042,
    @ProductID = 58,
    @Quantity = 3,
    @Discount = 0.10, -- 10% off
    @OrderID = @NewOrderTrackingNumber OUTPUT,      -- Capture return values
    @StatusMessage = @OperationStatusFeedback OUTPUT; -- Capture return values

-- View execution output results
SELECT 
    @NewOrderTrackingNumber AS [GeneratedOrderID], 
    @OperationStatusFeedback AS [SystemMessage];`
  }
]

export default function SqlVisualizerPage() {
  const [input, setInput] = useState('')
  const [report, setReport] = useState<SQLProcedureReport | null>(null)
  const [activeTab, setActiveTab] = useState<'flow' | 'params' | 'tables'>('flow')

  const convert = useCallback(() => {
    if (!input.trim()) return
    try {
      const rep = parseStoredProcedure(input.trim())
      setReport(rep)
    } catch (e) {
      console.error(e)
    }
  }, [input])

  // Pre-load the first example on mount
  useEffect(() => {
    setInput(EXAMPLES[0].value)
    const initialReport = parseStoredProcedure(EXAMPLES[0].value)
    setReport(initialReport)
  }, [])

  const renderStepNode = (step: SQLFlowStep) => {
    let icon = <Code2 size={16} />
    let border = 'var(--border)'
    let bg = 'var(--surface-3)'

    if (step.type === 'decision') {
      icon = <GitBranch size={16} style={{ color: 'var(--amber)' }} />
      border = 'rgba(245,158,11,0.22)'
      bg = 'rgba(245,158,11,0.06)'
    } else if (step.type === 'loop') {
      icon = <RefreshCw size={16} style={{ color: 'var(--purple)' }} />
      border = 'rgba(167,139,250,0.22)'
      bg = 'rgba(167,139,250,0.06)'
    } else if (step.type === 'transaction') {
      icon = <Shield size={16} style={{ color: 'var(--accent)' }} />
      border = 'rgba(0,200,122,0.22)'
      bg = 'rgba(0,200,122,0.06)'
    } else if (step.type === 'query') {
      icon = <Database size={16} style={{ color: 'var(--blue)' }} />
      border = 'rgba(56,189,248,0.22)'
      bg = 'rgba(56,189,248,0.06)'
    }

    return (
      <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {/* Node block */}
        <div style={{
          width: '100%', maxWidth: 440,
          background: bg, border: `1px solid ${border}`,
          borderRadius: 14, padding: '16px 20px',
          display: 'flex', gap: 16, alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          transition: 'all 0.2s',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--border)'
          }}>
            {icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{step.title}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-2)', fontFamily: 'var(--font-geist-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {step.subtitle}
            </div>
            {step.tables && step.tables.length > 0 && (
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {step.tables.map(tbl => (
                  <span key={tbl} style={{
                    fontSize: 9.5, fontWeight: 700, padding: '2px 8px',
                    borderRadius: 6, background: 'var(--surface)',
                    color: 'var(--accent)', border: '1px solid var(--border)'
                  }}>
                    {tbl}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Nested Child Nodes */}
        {step.children && step.children.length > 0 && (
          <div style={{
            width: '90%', borderLeft: '1.5px dashed var(--border)',
            paddingLeft: 20, marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14
          }}>
            {step.children.map(child => renderStepNode(child))}
          </div>
        )}

        {/* Connective Line (if not nested) */}
        {!step.children && (
          <div style={{ width: 1.5, height: 24, background: 'linear-gradient(to bottom, var(--border), transparent)' }} />
        )}
      </div>
    )
  }

  const btnStyle = {
    background: 'var(--surface-3)',
    border: '1px solid var(--border)',
    color: 'var(--text-2)',
    borderRadius: 6,
    padding: '4px 10px',
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
    padding: '12px 18px',
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

  return (
    <ToolLayout title="Stored Procedure Visualizer" badge="DB">
      {/* 2-Column Responsive Workspace */}
      <div style={{
        display: 'flex',
        border: '1px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
        background: 'var(--surface)',
        minHeight: 520,
      }} className="editor-panel-container">
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
          .convert-spacer {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-left: 1px solid var(--border);
            border-right: 1px solid var(--border);
            background: var(--surface-2);
            width: 56px;
            flex-shrink: 0;
          }
          @media (max-width: 992px) {
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

        {/* LEFT COLUMN: Input SQL Code Editor */}
        <div className="pane">
          <div style={headerStyle}>
            <div style={labelStyle}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
              Stored Procedure SQL
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              <button style={btnStyle} onClick={() => {
                const ex = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]
                setInput(ex.value)
                setReport(parseStoredProcedure(ex.value))
              }} title="Load random example">
                <Shuffle size={10} />
                example
              </button>
              <button style={btnStyle} onClick={() => { setInput(''); setReport(null) }} title="Clear input">
                <Trash2 size={10} />
                clear
              </button>
            </div>
          </div>
          <textarea
            className="code-textarea"
            style={{
              flex: 1, minHeight: 460,
              background: 'transparent', border: 'none',
              padding: 20, fontFamily: 'var(--font-geist-mono)',
              fontSize: 13, color: 'var(--text)', outline: 'none', resize: 'none'
            }}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="CREATE PROCEDURE GetUserSummary AS ..."
            onKeyDown={e => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault()
                convert()
              }
            }}
          />
        </div>

        {/* CENTER COLUMN: Run Trigger Button */}
        <div className="convert-spacer">
          <button
            className="convert-btn"
            onClick={convert}
            title={`Visualize (Ctrl+Enter)`}
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
            <Play size={12} fill="#000" style={{ transform: 'rotate(90deg)' }} />
            <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 7.5, color: '#000', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              RUN
            </span>
          </button>
        </div>

        {/* RIGHT COLUMN: The Visualizer Dashboard (NO RAW REPORT JSON) */}
        <div className="pane" style={{ background: 'var(--surface-2)' }}>
          <div style={headerStyle}>
            <div style={labelStyle}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--amber)', display: 'inline-block' }} />
              Visual Flowchart & Schema
            </div>

            {/* Dashboard Tabs centered inside header */}
            {report && (
              <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', padding: 3, borderRadius: 8 }}>
                {(['flow', 'params', 'tables'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '4px 12px', borderRadius: 6, border: 'none',
                      background: activeTab === tab ? 'rgba(0,0,0,0.06)' : 'transparent',
                      color: activeTab === tab ? 'var(--text)' : 'var(--text-3)',
                      fontSize: 10, fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ flex: 1, padding: 24, overflowY: 'auto', maxHeight: 460 }}>
            {report ? (
              <>
                {/* Meta details banner */}
                <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{report.name}</h3>
                  <span style={{
                    fontSize: 9, fontWeight: 800, padding: '3px 8px',
                    borderRadius: 6, background: 'var(--accent-bg)', color: 'var(--accent)'
                  }}>
                    {report.dialect} PROCEDURE
                  </span>
                </div>

                {/* Content Renderers */}
                {activeTab === 'flow' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                    {report.flow.map(step => renderStepNode(step))}
                    {/* End marker node */}
                    <div style={{
                      padding: '6px 16px', borderRadius: 99,
                      background: 'var(--surface-3)', border: '1px solid var(--border)',
                      fontSize: 10, fontWeight: 700, color: 'var(--text-2)', letterSpacing: '0.05em'
                    }}>
                      END PROCEDURE
                    </div>
                  </div>
                )}

                {activeTab === 'params' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {report.parameters.length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-3)' }}>
                            <th style={{ padding: '8px 12px' }}>Name</th>
                            <th style={{ padding: '8px 12px' }}>Type / Origin</th>
                            <th style={{ padding: '8px 12px' }}>Direction</th>
                            <th style={{ padding: '8px 12px' }}>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.parameters.map((p, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-geist-mono)', fontWeight: 600, color: 'var(--accent)' }}>{p.name}</td>
                              <td style={{ padding: '10px 12px', color: 'var(--text)', fontFamily: 'var(--font-geist-mono)' }}>{p.type}</td>
                              <td style={{ padding: '10px 12px' }}>
                                <span style={{
                                  fontSize: 9, fontWeight: 700, padding: '2px 6px',
                                  borderRadius: 4, background: p.dir === 'OUT' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                                  color: p.dir === 'OUT' ? 'var(--red)' : 'var(--accent)'
                                }}>
                                  {p.dir}
                                </span>
                              </td>
                              <td style={{ padding: '10px 12px', color: 'var(--text-2)', fontFamily: 'var(--font-geist-mono)' }}>{p.defaultVal || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)', fontSize: 13 }}>No variables detected.</div>
                    )}
                  </div>
                )}

                {activeTab === 'tables' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>Referenced Tables</div>
                    {report.tables.length > 0 ? (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {report.tables.map(tbl => (
                          <div key={tbl} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '8px 16px', borderRadius: 10,
                            background: 'var(--surface-3)', border: '1px solid var(--border)'
                          }}>
                            <Database size={14} style={{ color: 'var(--accent)' }} />
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-geist-mono)' }}>{tbl}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)', fontSize: 13 }}>No table dependencies detected.</div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--text-3)' }}>
                <Columns size={32} strokeWidth={1.5} />
                <div style={{ fontSize: 13 }}>Enter raw stored procedure SQL and click Visualize Flow</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ExamplesGrid examples={EXAMPLES} onSelect={v => {
        setInput(v)
        setReport(parseStoredProcedure(v))
      }} />
    </ToolLayout>
  )
}

/**
 * SQL Stored Procedure Parser
 * Client-Side state-machine to extract parameters, table dependencies,
 * and logical control flow nodes from stored procedures.
 */

export interface SQLParameter {
  name: string
  type: string
  dir: 'IN' | 'OUT' | 'INOUT'
  defaultVal?: string
}

export interface SQLFlowStep {
  id: string
  type: 'query' | 'decision' | 'loop' | 'transaction' | 'statement'
  title: string
  subtitle?: string
  tables?: string[]
  children?: SQLFlowStep[]
}

export interface SQLProcedureReport {
  name: string
  dialect: 'MSSQL' | 'MySQL' | 'PostgreSQL' | 'Unknown'
  parameters: SQLParameter[]
  tables: string[]
  flow: SQLFlowStep[]
}

export function parseStoredProcedure(sql: string): SQLProcedureReport {
  const cleanSql = sql.replace(/\/\*[\s\S]*?\*\//g, '').replace(/--.*$/gm, '')
  
  // 1. Detect Dialect
  let dialect: SQLProcedureReport['dialect'] = 'Unknown'
  if (/@\w+/.test(cleanSql) || /AS\s+BEGIN/i.test(cleanSql)) {
    dialect = 'MSSQL'
  } else if (/LANGUAGE\s+plpgsql/i.test(cleanSql) || /RETURNS\s+\w+/i.test(cleanSql)) {
    dialect = 'PostgreSQL'
  } else if (/CREATE\s+PROCEDURE/i.test(cleanSql) && (/INOUT\s+/i.test(cleanSql) || /IN\s+/i.test(cleanSql))) {
    dialect = 'MySQL'
  }

  // 2. Extract Procedure Name
  let name = 'StoredProcedure'
  const nameMatch = cleanSql.match(/CREATE\s+(?:PROCEDURE|FUNCTION)\s+([a-zA-Z0-9_.]+)/i)
  const execMatch = cleanSql.match(/(?:EXEC|EXECUTE|CALL)\s+([a-zA-Z0-9_.]+)/i)
  if (nameMatch) {
    name = nameMatch[1]
  } else if (execMatch) {
    name = execMatch[1]
  }

  // 3. Extract Parameters
  const parameters: SQLParameter[] = []
  // Matches parameters inside bracket blocks or DECLARE / EXEC statements
  const paramBlockMatch = cleanSql.match(/\(([\s\S]*?)\)\s*(?:RETURNS|AS|BEGIN|LANGUAGE)/i)
  
  if (paramBlockMatch) {
    const rawParams = paramBlockMatch[1].split(',')
    rawParams.forEach(raw => {
      const trimmed = raw.trim()
      if (!trimmed) return

      if (dialect === 'MSSQL') {
        // e.g. @UserId INT = NULL
        const match = trimmed.match(/(@\w+)\s+([a-zA-Z0-9_()]+)(?:\s*=\s*([a-zA-Z0-9_'"\s]+))?/i)
        if (match) {
          parameters.push({
            name: match[1],
            type: match[2].trim(),
            dir: 'IN',
            defaultVal: match[3]?.trim()
          })
        }
      } else {
        // e.g. IN userId INT
        const parts = trimmed.split(/\s+/)
        let dir: SQLParameter['dir'] = 'IN'
        let pName = ''
        let pType = ''

        if (['IN', 'OUT', 'INOUT'].includes(parts[0].toUpperCase())) {
          dir = parts[0].toUpperCase() as SQLParameter['dir']
          pName = parts[1] || ''
          pType = parts.slice(2).join(' ')
        } else {
          pName = parts[0] || ''
          pType = parts.slice(1).join(' ')
        }

        if (pName && pType) {
          parameters.push({ name: pName, type: pType, dir })
        }
      }
    })
    // Parser for execution scripts parameters
    // 1. Scan DECLARE variables
    const declareRegex = /DECLARE\s+(@\w+)\s+([a-zA-Z0-9_()]+)/gi
    let match
    while ((match = declareRegex.exec(cleanSql)) !== null) {
      parameters.push({
        name: match[1],
        type: match[2].toUpperCase(),
        dir: 'OUT', // Variables holding returns
        defaultVal: 'Declared Variable'
      })
    }

    // 2. Scan EXEC parameters passed
    const execRegex = /(@\w+)\s*=\s*([a-zA-Z0-9_@.]+)(?:\s+(OUTPUT))?/gi
    let execMatch
    while ((execMatch = execRegex.exec(cleanSql)) !== null) {
      // Check if parameter already added by DECLARE
      const currentParam = execMatch[1]
      if (!parameters.some(p => p.name === currentParam)) {
        parameters.push({
          name: currentParam,
          type: 'Argument',
          dir: execMatch[3] ? 'OUT' : 'IN',
          defaultVal: execMatch[2]
        })
      }
    }
  }

  // 4. Extract Referenced Tables
  const tablesSet = new Set<string>()
  const tablePatterns = [
    /FROM\s+([a-zA-Z0-9_.]+)/gi,
    /JOIN\s+([a-zA-Z0-9_.]+)/gi,
    /INSERT\s+INTO\s+([a-zA-Z0-9_.]+)/gi,
    /UPDATE\s+([a-zA-Z0-9_.]+)/gi,
    /DELETE\s+FROM\s+([a-zA-Z0-9_.]+)/gi
  ]

  tablePatterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(cleanSql)) !== null) {
      const tbl = match[1].toLowerCase()
      // Skip system keywords or functions
      if (!['select', 'update', 'insert', 'delete', 'values', 'where', 'and', 'or'].includes(tbl)) {
        tablesSet.add(tbl)
      }
    }
  })
  const tables = Array.from(tablesSet)

  // 5. Construct execution flow steps (dynamic SVG nodes mapping)
  const flow: SQLFlowStep[] = []
  let stepCounter = 1

  // Parse lines to build a basic step hierarchy
  const lines = cleanSql.split('\n')
  let currentTransaction: SQLFlowStep | null = null

  lines.forEach(line => {
    const trimmed = line.trim()
    if (!trimmed) return

    // Identify Transactions
    if (/BEGIN\s+(?:TRAN|TRANSACTION)/i.test(trimmed)) {
      currentTransaction = {
        id: `step-${stepCounter++}`,
        type: 'transaction',
        title: 'Transaction Scope',
        subtitle: 'BEGIN TRANSACTION',
        children: []
      }
      flow.push(currentTransaction)
      return
    }

    if (/COMMIT|ROLLBACK/i.test(trimmed) && currentTransaction) {
      currentTransaction = null // Close transaction block
      return
    }

    // Determine Step Category
    let parsedStep: SQLFlowStep | null = null

    if (/SELECT\s+/i.test(trimmed)) {
      const refTbls = tables.filter(t => new RegExp(`\\b${t}\\b`, 'i').test(trimmed))
      parsedStep = {
        id: `step-${stepCounter++}`,
        type: 'query',
        title: 'Select Query',
        subtitle: trimmed.slice(0, 45) + (trimmed.length > 45 ? '...' : ''),
        tables: refTbls
      }
    } else if (/INSERT\s+INTO/i.test(trimmed)) {
      const refTbls = tables.filter(t => new RegExp(`\\b${t}\\b`, 'i').test(trimmed))
      parsedStep = {
        id: `step-${stepCounter++}`,
        type: 'query',
        title: 'Insert Record',
        subtitle: trimmed.slice(0, 45) + (trimmed.length > 45 ? '...' : ''),
        tables: refTbls
      }
    } else if (/UPDATE\s+/i.test(trimmed)) {
      const refTbls = tables.filter(t => new RegExp(`\\b${t}\\b`, 'i').test(trimmed))
      parsedStep = {
        id: `step-${stepCounter++}`,
        type: 'query',
        title: 'Update Record',
        subtitle: trimmed.slice(0, 45) + (trimmed.length > 45 ? '...' : ''),
        tables: refTbls
      }
    } else if (/DELETE\s+FROM/i.test(trimmed)) {
      const refTbls = tables.filter(t => new RegExp(`\\b${t}\\b`, 'i').test(trimmed))
      parsedStep = {
        id: `step-${stepCounter++}`,
        type: 'query',
        title: 'Delete Record',
        subtitle: trimmed.slice(0, 45) + (trimmed.length > 45 ? '...' : ''),
        tables: refTbls
      }
    } else if (/IF\s+/i.test(trimmed)) {
      parsedStep = {
        id: `step-${stepCounter++}`,
        type: 'decision',
        title: 'Conditional Branch',
        subtitle: trimmed.slice(0, 40) + (trimmed.length > 40 ? '...' : '')
      }
    } else if (/WHILE\s+/i.test(trimmed)) {
      parsedStep = {
        id: `step-${stepCounter++}`,
        type: 'loop',
        title: 'Loop Condition',
        subtitle: trimmed.slice(0, 40) + (trimmed.length > 40 ? '...' : '')
      }
    }

    if (parsedStep) {
      if (currentTransaction && currentTransaction.children) {
        currentTransaction.children.push(parsedStep)
      } else {
        flow.push(parsedStep)
      }
    }
  })

  // Fallback step if flow is empty
  if (flow.length === 0) {
    flow.push({
      id: `step-1`,
      type: 'statement',
      title: 'Stored Procedure Scope',
      subtitle: 'Runs queries and actions sequentially'
    })
  }

  return { name, dialect, parameters, tables, flow }
}

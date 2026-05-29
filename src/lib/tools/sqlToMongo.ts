// ── SQL → MongoDB converter ──────────────────────────────────────────

function pv(v: string): unknown {
  v = v.trim()
  if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1)
  if (v === 'NULL' || v === 'null') return null
  if (v === 'TRUE' || v === 'true') return true
  if (v === 'FALSE' || v === 'false') return false
  const n = Number(v)
  return isNaN(n) ? v : n
}

function pl(s: string): unknown[] {
  return s.split(',').map(v => pv(v.trim()))
}

function lr(p: string): string {
  let r = p.replace(/%/g, '.*').replace(/_/g, '.')
  if (!p.startsWith('%')) r = '^' + r
  if (!p.endsWith('%')) r = r + '$'
  return r
}

function splitTop(s: string, sep: string): string[] {
  const parts: string[] = []
  let d = 0, l = 0
  const u = s.toUpperCase(), su = sep.toUpperCase()
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') d++
    else if (s[i] === ')') d--
    else if (d === 0 && u.startsWith(su, i)) {
      parts.push(s.slice(l, i))
      i += sep.length - 1
      l = i + 1
    }
  }
  parts.push(s.slice(l))
  return parts.filter(p => p.trim())
}

function parseCond(c: string): Record<string, unknown> {
  c = c.trim()
  while (c.startsWith('(') && c.endsWith(')')) c = c.slice(1, -1).trim()
  let m: RegExpMatchArray | null
  if ((m = c.match(/^(\w+)\s+IS\s+NOT\s+NULL$/i))) return { [m[1]]: { $ne: null } }
  if ((m = c.match(/^(\w+)\s+IS\s+NULL$/i))) return { [m[1]]: null }
  if ((m = c.match(/^(\w+)\s+BETWEEN\s+(.+)\s+AND\s+(.+)$/i))) return { [m[1]]: { $gte: pv(m[2]), $lte: pv(m[3]) } }
  if ((m = c.match(/^(\w+)\s+NOT\s+IN\s*\((.+)\)$/i))) return { [m[1]]: { $nin: pl(m[2]) } }
  if ((m = c.match(/^(\w+)\s+IN\s*\((.+)\)$/i))) return { [m[1]]: { $in: pl(m[2]) } }
  if ((m = c.match(/^(\w+)\s+NOT\s+LIKE\s+'(.+)'$/i))) return { [m[1]]: { $not: { $regex: lr(m[2]), $options: 'i' } } }
  if ((m = c.match(/^(\w+)\s+LIKE\s+'(.+)'$/i))) return { [m[1]]: { $regex: lr(m[2]), $options: 'i' } }
  const ops: [string, string | null][] = [['!=', '$ne'], ['<>', '$ne'], ['>=', '$gte'], ['<=', '$lte'], ['>', '$gt'], ['<', '$lt'], ['=', null]]
  for (const [op, mo] of ops) {
    const idx = c.indexOf(op)
    if (idx > 0) {
      const field = c.slice(0, idx).trim().replace(/^\w+\./, '')
      const val = pv(c.slice(idx + op.length).trim())
      return mo === null ? { [field]: val } : { [field]: { [mo]: val } }
    }
  }
  return {}
}

function parseWhere(w: string): Record<string, unknown> {
  w = w.trim()
  const or = splitTop(w, ' OR ')
  if (or.length > 1) return { $or: or.map(p => parseCond(p.trim())) }
  const and = splitTop(w, ' AND ')
  if (and.length > 1) return Object.assign({}, ...and.map(p => parseCond(p.trim())))
  return parseCond(w)
}

function parseCols(s: string): Record<string, number> | null {
  if (!s || s.trim() === '*') return null
  const p: Record<string, number> = {}
  s.split(',').forEach(c => {
    c = c.trim()
    const am = c.match(/(\S+)\s+AS\s+\S+/i)
    const key = am ? am[1].replace(/^\w+\./, '') : c.replace(/^\w+\./, '')
    p[key] = 1
  })
  return Object.keys(p).length ? p : null
}

function fmt(o: unknown, i = 0): string {
  const p = '  '.repeat(i), p1 = '  '.repeat(i + 1)
  if (o === null) return 'null'
  if (o === undefined) return 'undefined'
  if (typeof o === 'string') return `"${o}"`
  if (typeof o === 'number' || typeof o === 'boolean') return String(o)
  if (Array.isArray(o)) {
    if (!o.length) return '[]'
    return `[\n${o.map((x: unknown) => p1 + fmt(x, i + 1)).join(',\n')}\n${p}]`
  }
  if (typeof o === 'object') {
    const entries = Object.entries(o as Record<string, unknown>)
    if (!entries.length) return '{}'
    return `{\n${entries.map(([k, v]) => `${p1}${k}: ${fmt(v, i + 1)}`).join(',\n')}\n${p}}`
  }
  return String(o)
}

export function convertSqlToMongo(rawSql: string, dialect: string): string {
  const sql = rawSql.replace(/\s+/g, ' ').trim()
  const up = sql.toUpperCase()

  if (up.startsWith('SELECT')) return doSelect(sql, dialect)
  if (up.startsWith('INSERT')) return doInsert(sql, dialect)
  if (up.startsWith('UPDATE')) return doUpdate(sql, dialect)
  if (up.startsWith('DELETE')) return doDelete(sql, dialect)
  return '// Unsupported query type.\n// FenaQuery supports: SELECT, INSERT, UPDATE, DELETE'
}

function doSelect(sql: string, dialect: string): string {
  if (/\b(?:INNER|LEFT|RIGHT|FULL|CROSS)?\s*JOIN\b/i.test(sql)) return doJoin(sql, dialect)

  const cm = sql.match(/SELECT\s+COUNT\s*\(\s*\*?\s*\)\s+FROM\s+(\w+)(.*)/i)
  if (cm) {
    const w = cm[2].match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|$)/i)
    return `// Dialect: ${dialect.toUpperCase()} · COUNT(*) → countDocuments()\ndb.${cm[1]}.countDocuments(${fmt(w ? parseWhere(w[1]) : {})})`
  }

  const dm = sql.match(/SELECT\s+DISTINCT\s+(\S+)\s+FROM\s+(\w+)(.*)/i)
  if (dm) {
    const w = dm[3].match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|$)/i)
    return `// Dialect: ${dialect.toUpperCase()} · SELECT DISTINCT → distinct()\ndb.${dm[2]}.distinct("${dm[1]}", ${fmt(w ? parseWhere(w[1]) : {})})`
  }

  const sm = sql.match(/SELECT\s+([\s\S]+?)\s+FROM\s+(\w+)([\s\S]*)/i)
  if (!sm) throw new Error('Could not parse SELECT statement.')
  const [, cols, table, rest] = sm

  const wm = rest.match(/WHERE\s+([\s\S]+?)(?:\s+ORDER\s+BY|\s+GROUP\s+BY|\s+LIMIT|\s+TOP|$)/i)
  const om = rest.match(/ORDER\s+BY\s+([\s\S]+?)(?:\s+LIMIT|$)/i)
  const lm = rest.match(/(?:LIMIT|TOP\s+)(\d+)/i)

  const filter = wm ? parseWhere(wm[1].trim()) : {}
  const proj = parseCols(cols)
  const hf = Object.keys(filter).length > 0
  const hp = proj !== null

  let chain = `db.${table}.find(`
  if (hf && hp) chain += `${fmt(filter)},\n  ${fmt(proj)}`
  else if (hf) chain += fmt(filter)
  else if (hp) chain += `{}, ${fmt(proj)}`
  chain += ')'

  if (om) {
    const sort: Record<string, number> = {}
    om[1].split(',').forEach(p => {
      const m = p.trim().match(/(\w+)\s*(ASC|DESC)?/i)
      if (m) sort[m[1]] = (m[2] || 'ASC').toUpperCase() === 'DESC' ? -1 : 1
    })
    chain += `\n  .sort(${fmt(sort)})`
  }
  if (lm) chain += `\n  .limit(${lm[1]})`

  return `// Dialect: ${dialect.toUpperCase()} · SELECT → find()\n\n${chain}`
}

function doJoin(sql: string, dialect: string): string {
  const m = sql.match(/SELECT\s+[\s\S]+?\s+FROM\s+(\w+)(?:\s+(?:AS\s+)?\w+)?\s+((?:INNER|LEFT|RIGHT)?\s*JOIN[\s\S]+?)(?:\s+WHERE\s+([\s\S]+?))?(?:\s+ORDER|\s+LIMIT|$)/i)
  if (!m) throw new Error('Could not parse JOIN.')
  const jm = m[2].match(/(?:INNER|LEFT|RIGHT)?\s*JOIN\s+(\w+)(?:\s+(?:AS\s+)?\w+)?\s+ON\s+([\s\S]+)/i)
  const t2 = jm ? jm[1] : 'collection2'
  const onStr = jm ? jm[2] : ''
  const op = onStr.match(/(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/)
  const lf = op ? op[2] : 'id', ff = op ? op[4] : 'userId'
  const filter = m[3] ? parseWhere(m[3]) : {}
  const pipeline = [
    { $lookup: { from: t2, localField: lf, foreignField: ff, as: t2 } },
    { $unwind: `$${t2}` },
    ...(Object.keys(filter).length ? [{ $match: filter }] : []),
  ]
  return `// Dialect: ${dialect.toUpperCase()} · JOIN → $lookup aggregation\n\ndb.${m[1]}.aggregate([\n${pipeline.map(s => '  ' + fmt(s)).join(',\n')}\n])`
}

function doInsert(sql: string, dialect: string): string {
  const m = sql.match(/INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i)
  if (!m) throw new Error('Could not parse INSERT.')
  const cols = m[2].split(',').map(c => c.trim())
  const vals = m[3].split(',').map(v => pv(v.trim()))
  const doc: Record<string, unknown> = {}
  cols.forEach((c, i) => { doc[c] = vals[i] })
  return `// Dialect: ${dialect.toUpperCase()} · INSERT → insertOne()\n\ndb.${m[1]}.insertOne(${fmt(doc)})`
}

function doUpdate(sql: string, dialect: string): string {
  const m = sql.match(/UPDATE\s+(\w+)\s+SET\s+([\s\S]+?)(?:\s+WHERE\s+([\s\S]+))?$/i)
  if (!m) throw new Error('Could not parse UPDATE.')
  const sd: Record<string, unknown> = {}
  m[2].trim().split(',').forEach(p => {
    const eq = p.indexOf('=')
    if (eq < 0) return
    sd[p.slice(0, eq).trim()] = pv(p.slice(eq + 1).trim())
  })
  const filter = m[3] ? parseWhere(m[3].trim()) : {}
  return `// Dialect: ${dialect.toUpperCase()} · UPDATE → updateMany()\n\ndb.${m[1]}.updateMany(\n  ${fmt(filter)},\n  { $set: ${fmt(sd)} }\n)`
}

function doDelete(sql: string, dialect: string): string {
  const m = sql.match(/DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+([\s\S]+))?$/i)
  if (!m) throw new Error('Could not parse DELETE.')
  const filter = m[2] ? parseWhere(m[2].trim()) : {}
  const warn = !m[2] ? '\n// ⚠ No WHERE clause — this will delete ALL documents' : ''
  return `// Dialect: ${dialect.toUpperCase()} · DELETE → deleteMany()${warn}\n\ndb.${m[1]}.deleteMany(${fmt(filter)})`
}

export function highlightMongo(text: string): string {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(\/\/.*)/g, '<span class="syn-cmt">$1</span>')
    .replace(/\b(db\.\w+\.\w+)\b/g, '<span class="syn-key">$1</span>')
    .replace(/(\$\w+)/g, '<span class="syn-kw">$1</span>')
    .replace(/"([^"]*)"/g, '<span class="syn-str">"$1"</span>')
    .replace(/\b(-?\d+\.?\d*)\b/g, '<span class="syn-num">$1</span>')
    .replace(/\b(null|true|false)\b/g, '<span class="syn-op">$1</span>')
}

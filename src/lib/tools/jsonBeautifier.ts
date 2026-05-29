// ── JSON Beautifier / Minifier ───────────────────────────────────────

export function beautifyJson(input: string, indent = 2): string {
  let parsed = JSON.parse(input)
  // If the parsed result is a string, it might be stringified JSON (escaped)
  if (typeof parsed === 'string') {
    try {
      const secondParse = JSON.parse(parsed)
      parsed = secondParse
    } catch {
      // Not a JSON string, just a normal string
    }
  }
  return JSON.stringify(parsed, null, indent)
}

export function minifyJson(input: string): string {
  let parsed = JSON.parse(input)
  if (typeof parsed === 'string') {
    try {
      const secondParse = JSON.parse(parsed)
      parsed = secondParse
    } catch {
      // Not a JSON string
    }
  }
  return JSON.stringify(parsed)
}

export function validateJson(input: string): { valid: boolean; error?: string } {
  try {
    const parsed = JSON.parse(input)
    if (typeof parsed === 'string') {
      try {
        JSON.parse(parsed)
        return { valid: true }
      } catch {
        // It's a valid string, but not valid JSON inside the string
        // We probably want to treat this as valid if the user specifically intended to beautify a string
        // but for a "JSON Beautifier", usually they want an object/array.
        // However, technically a string is valid JSON.
      }
    }
    return { valid: true }
  } catch (e) {
    return { valid: false, error: (e as Error).message }
  }
}

/** Syntax-highlight JSON for display */
export function highlightJson(json: string): string {
  // Escape HTML first
  const escaped = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    match => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) return `<span class="syn-key">${match}</span>`
        return `<span class="syn-str">${match}</span>`
      }
      if (/true|false/.test(match)) return `<span class="syn-op">${match}</span>`
      if (/null/.test(match)) return `<span class="syn-op">${match}</span>`
      return `<span class="syn-num">${match}</span>`
    }
  )
}

export function getJsonStats(input: string): {
  keys: number
  depth: number
  size: string
} {
  try {
    let obj = JSON.parse(input)
    if (typeof obj === 'string') {
      try {
        obj = JSON.parse(obj)
      } catch {
        // Not a JSON string
      }
    }
    
    let keys = 0, maxDepth = 0

    const walk = (o: unknown, d: number) => {
      if (d > maxDepth) maxDepth = d
      if (o && typeof o === 'object') {
        if (Array.isArray(o)) o.forEach(v => walk(v, d + 1))
        else {
          keys += Object.keys(o).length
          Object.values(o).forEach(v => walk(v, d + 1))
        }
      }
    }

    walk(obj, 0)
    const bytes = new TextEncoder().encode(input).length
    const size = bytes < 1024 ? `${bytes}B` : `${(bytes / 1024).toFixed(1)}KB`
    return { keys, depth: maxDepth, size }
  } catch {
    return { keys: 0, depth: 0, size: '0B' }
  }
}

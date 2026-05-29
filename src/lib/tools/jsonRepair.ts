/**
 * Premium Client-Side JSON Repair Utility
 * Autocorrects comments, single quotes, unquoted keys, trailing commas, 
 * Python values, and unclosed braces/brackets.
 */
export function repairJson(input: string): string {
  // 1. Remove comments
  let s = input
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove multi-line
    .replace(/\/\/.*$/gm, '')        // remove single-line

  s = s.trim()

  // 2. Tokenize and reconstruct character by character
  let result = ''
  let i = 0
  let inString = false
  let stringChar = ''
  let bracketStack: string[] = []

  while (i < s.length) {
    const char = s[i]
    
    // Handle string boundaries
    if ((char === '"' || char === "'") && (i === 0 || s[i - 1] !== '\\')) {
      if (!inString) {
        inString = true
        stringChar = char
        result += '"' // standardize to double quotes
      } else if (char === stringChar) {
        inString = false
        result += '"'
      } else {
        // Nested quote of different type inside string
        result += '\\"' // escape double quotes if they were inside single quotes
      }
      i++
      continue
    }

    if (inString) {
      if (char === '"' && stringChar === "'") {
        result += '\\"'
      } else {
        result += char
      }
      i++
      continue
    }

    // Track brackets/braces for balancing at the end
    if (char === '{' || char === '[') {
      bracketStack.push(char)
    } else if (char === '}') {
      if (bracketStack[bracketStack.length - 1] === '{') bracketStack.pop()
    } else if (char === ']') {
      if (bracketStack[bracketStack.length - 1] === '[') bracketStack.pop()
    }

    // Map Python / JavaScript keywords
    if (s.slice(i, i + 4) === 'None' && !/[a-zA-Z0-9_$]/.test(s[i - 1] || '') && !/[a-zA-Z0-9_$]/.test(s[i + 4] || '')) {
      result += 'null'
      i += 4
      continue
    }
    if (s.slice(i, i + 4) === 'True' && !/[a-zA-Z0-9_$]/.test(s[i - 1] || '') && !/[a-zA-Z0-9_$]/.test(s[i + 4] || '')) {
      result += 'true'
      i += 4
      continue
    }
    if (s.slice(i, i + 5) === 'False' && !/[a-zA-Z0-9_$]/.test(s[i - 1] || '') && !/[a-zA-Z0-9_$]/.test(s[i + 5] || '')) {
      result += 'false'
      i += 5
      continue
    }
    if (s.slice(i, i + 9) === 'undefined' && !/[a-zA-Z0-9_$]/.test(s[i - 1] || '') && !/[a-zA-Z0-9_$]/.test(s[i + 9] || '')) {
      result += 'null'
      i += 9
      continue
    }

    // Auto-wrap unquoted keys:
    // Look ahead for an identifier followed by a colon
    if (/[a-zA-Z_]/.test(char) && !/[a-zA-Z0-9_$]/.test(s[i - 1] || '')) {
      let j = i
      while (j < s.length && /[a-zA-Z0-9_$]/.test(s[j])) {
        j++
      }
      // Check if followed by colon (ignoring space)
      let isKey = false
      let k = j
      while (k < s.length && /\s/.test(s[k])) {
        k++
      }
      if (s[k] === ':') {
        isKey = true
      }
      if (isKey) {
        const keyName = s.slice(i, j)
        result += `"${keyName}"`
        i = j
        continue
      }
    }

    result += char
    i++
  }

  // Remove trailing commas before } or ]
  result = result
    .replace(/,\s*\}/g, '}')
    .replace(/,\s*\]/g, ']')

  // Close missing brackets/braces in order
  while (bracketStack.length > 0) {
    const last = bracketStack.pop()
    if (last === '{') result += '}'
    if (last === '[') result += ']'
  }

  return result
}

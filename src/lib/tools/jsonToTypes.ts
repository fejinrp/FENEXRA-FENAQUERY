// ── JSON → Types converter ───────────────────────────────────────────

type JsonVal = string | number | boolean | null | JsonVal[] | JsonObj
type JsonObj = { [k: string]: JsonVal }

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function inferTsType(val: JsonVal, key: string, indent = 1): string {
  if (val === null) return 'null'
  if (typeof val === 'string') return 'string'
  if (typeof val === 'number') return Number.isInteger(val) ? 'number' : 'number'
  if (typeof val === 'boolean') return 'boolean'
  if (Array.isArray(val)) {
    if (!val.length) return 'unknown[]'
    return inferTsType(val[0], key, indent) + '[]'
  }
  if (typeof val === 'object') {
    const pad = '  '.repeat(indent)
    const fields = Object.entries(val)
      .map(([k, v]) => `${pad}  ${k}: ${inferTsType(v, k, indent + 1)};`)
      .join('\n')
    return `{\n${fields}\n${pad}}`
  }
  return 'unknown'
}

export function jsonToTypeScript(json: string, rootName = 'Root'): string {
  const obj = JSON.parse(json) as JsonObj
  const lines: string[] = [`export interface ${rootName} {`]
  for (const [k, v] of Object.entries(obj)) {
    lines.push(`  ${k}: ${inferTsType(v, k)};`)
  }
  lines.push('}')
  return lines.join('\n')
}

function inferCsharpType(val: JsonVal, key: string): string {
  if (val === null) return 'object?'
  if (typeof val === 'string') return 'string'
  if (typeof val === 'boolean') return 'bool'
  if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'double'
  if (Array.isArray(val)) {
    if (!val.length) return 'List<object>'
    return `List<${inferCsharpType(val[0], key)}>`
  }
  if (typeof val === 'object') return capitalize(key)
  return 'object'
}

export function jsonToCsharp(json: string, rootName = 'Root'): string {
  const obj = JSON.parse(json) as JsonObj
  const classes: string[] = []

  function buildClass(name: string, o: JsonObj) {
    const props = Object.entries(o).map(([k, v]) => {
      const type = inferCsharpType(v, k)
      if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
        buildClass(capitalize(k), v as JsonObj)
      }
      return `    public ${type} ${capitalize(k)} { get; set; }`
    })
    classes.unshift(`public class ${name}\n{\n${props.join('\n')}\n}`)
  }

  buildClass(rootName, obj)
  return classes.join('\n\n')
}

function inferPythonType(val: JsonVal, key: string): string {
  if (val === null) return 'Optional[Any]'
  if (typeof val === 'string') return 'str'
  if (typeof val === 'boolean') return 'bool'
  if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'float'
  if (Array.isArray(val)) {
    if (!val.length) return 'List[Any]'
    return `List[${inferPythonType(val[0], key)}]`
  }
  if (typeof val === 'object') return capitalize(key)
  return 'Any'
}

export function jsonToPython(json: string, rootName = 'Root'): string {
  const obj = JSON.parse(json) as JsonObj
  const classes: string[] = []

  function buildClass(name: string, o: JsonObj) {
    const fields = Object.entries(o).map(([k, v]) => {
      const type = inferPythonType(v, k)
      if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
        buildClass(capitalize(k), v as JsonObj)
      }
      return `    ${k}: ${type}`
    })
    classes.unshift(`@dataclass\nclass ${name}:\n${fields.join('\n')}`)
  }

  buildClass(rootName, obj)
  return `from dataclasses import dataclass\nfrom typing import Any, List, Optional\n\n${classes.join('\n\n')}`
}

function inferGoType(val: JsonVal, key: string): string {
  if (val === null) return 'interface{}'
  if (typeof val === 'string') return 'string'
  if (typeof val === 'boolean') return 'bool'
  if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'float64'
  if (Array.isArray(val)) {
    if (!val.length) return '[]interface{}'
    return `[]${inferGoType(val[0], key)}`
  }
  if (typeof val === 'object') return capitalize(key)
  return 'interface{}'
}

export function jsonToGo(json: string, rootName = 'Root'): string {
  const obj = JSON.parse(json) as JsonObj
  const structs: string[] = []

  function buildStruct(name: string, o: JsonObj) {
    const fields = Object.entries(o).map(([k, v]) => {
      const type = inferGoType(v, k)
      if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
        buildStruct(capitalize(k), v as JsonObj)
      }
      const jsonTag = `\`json:"${k}"\``
      return `\t${capitalize(k)} ${type} ${jsonTag}`
    })
    structs.unshift(`type ${name} struct {\n${fields.join('\n')}\n}`)
  }

  buildStruct(rootName, obj)
  return `package main\n\n${structs.join('\n\n')}`
}

export type TypeLang = 'typescript' | 'csharp' | 'python' | 'go'

export function convertJsonToTypes(json: string, lang: TypeLang, rootName = 'Root'): string {
  switch (lang) {
    case 'typescript': return jsonToTypeScript(json, rootName)
    case 'csharp':     return jsonToCsharp(json, rootName)
    case 'python':     return jsonToPython(json, rootName)
    case 'go':         return jsonToGo(json, rootName)
  }
}

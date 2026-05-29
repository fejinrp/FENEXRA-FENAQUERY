/**
 * Premium Client-Side JSON to Language Array/List Utility
 * Converts parsed JSON data into idiomatic formats for PHP, Python, JavaScript, and Dart.
 */

function getIndent(depth: number, spaces = 2): string {
  return ' '.repeat(depth * spaces);
}

/** Serialize raw values recursively into a PHP Associative/Indexed Array */
export function jsonToPhp(val: any, depth = 0): string {
  const currentIndent = getIndent(depth);
  const nextIndent = getIndent(depth + 1);

  if (val === null) return 'null';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') {
    const escaped = val.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    return `"${escaped}"`;
  }

  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    const items = val.map(item => jsonToPhp(item, depth + 1));
    return `[\n${nextIndent}${items.join(`,\n${nextIndent}`)}\n${currentIndent}]`;
  }

  if (typeof val === 'object') {
    const keys = Object.keys(val);
    if (keys.length === 0) return '[]';
    const pairs = keys.map(key => {
      const escapedKey = key.replace(/"/g, '\\"');
      return `"${escapedKey}" => ${jsonToPhp(val[key], depth + 1)}`;
    });
    return `[\n${nextIndent}${pairs.join(`,\n${nextIndent}`)}\n${currentIndent}]`;
  }

  return 'null';
}

/** Serialize raw values recursively into a Python Dict/List */
export function jsonToPython(val: any, depth = 0): string {
  const currentIndent = getIndent(depth);
  const nextIndent = getIndent(depth + 1);

  if (val === null) return 'None';
  if (typeof val === 'boolean') return val ? 'True' : 'False';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') {
    const escaped = val.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    return `"${escaped}"`;
  }

  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    const items = val.map(item => jsonToPython(item, depth + 1));
    return `[\n${nextIndent}${items.join(`,\n${nextIndent}`)}\n${currentIndent}]`;
  }

  if (typeof val === 'object') {
    const keys = Object.keys(val);
    if (keys.length === 0) return '{}';
    const pairs = keys.map(key => {
      const escapedKey = key.replace(/"/g, '\\"');
      return `"${escapedKey}": ${jsonToPython(val[key], depth + 1)}`;
    });
    return `{\n${nextIndent}${pairs.join(`,\n${nextIndent}`)}\n${currentIndent}}`;
  }

  return 'None';
}

/** Serialize raw values recursively into a JavaScript ES6 Object (unquoted keys) */
export function jsonToJs(val: any, depth = 0): string {
  const currentIndent = getIndent(depth);
  const nextIndent = getIndent(depth + 1);

  if (val === null) return 'null';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') {
    const escaped = val.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    return `"${escaped}"`;
  }

  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    const items = val.map(item => jsonToJs(item, depth + 1));
    return `[\n${nextIndent}${items.join(`,\n${nextIndent}`)}\n${currentIndent}]`;
  }

  if (typeof val === 'object') {
    const keys = Object.keys(val);
    if (keys.length === 0) return '{}';
    const pairs = keys.map(key => {
      // Unquote keys if they are valid JS identifiers
      const isValidIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
      const formattedKey = isValidIdentifier ? key : `"${key.replace(/"/g, '\\"')}"`;
      return `${formattedKey}: ${jsonToJs(val[key], depth + 1)}`;
    });
    return `{\n${nextIndent}${pairs.join(`,\n${nextIndent}`)}\n${currentIndent}}`;
  }

  return 'null';
}

/** Serialize raw values recursively into a Dart Map/List */
export function jsonToDart(val: any, depth = 0): string {
  const currentIndent = getIndent(depth);
  const nextIndent = getIndent(depth + 1);

  if (val === null) return 'null';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') {
    const escaped = val.replace(/'/g, "\\'").replace(/\n/g, '\\n');
    return `'${escaped}'`;
  }

  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    const items = val.map(item => jsonToDart(item, depth + 1));
    return `[\n${nextIndent}${items.join(`,\n${nextIndent}`)}\n${currentIndent}]`;
  }

  if (typeof val === 'object') {
    const keys = Object.keys(val);
    if (keys.length === 0) return '{}';
    const pairs = keys.map(key => {
      const escapedKey = key.replace(/'/g, "\\'");
      return `'${escapedKey}': ${jsonToDart(val[key], depth + 1)}`;
    });
    return `{\n${nextIndent}${pairs.join(`,\n${nextIndent}`)}\n${currentIndent}}`;
  }

  return 'null';
}

/** Serialize raw values recursively into a C# (.NET) Dictionary/List structure */
export function jsonToCSharp(val: any, depth = 0): string {
  const currentIndent = getIndent(depth);
  const nextIndent = getIndent(depth + 1);

  if (val === null) return 'null';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') {
    const escaped = val.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    return `"${escaped}"`;
  }

  if (Array.isArray(val)) {
    if (val.length === 0) return 'new object[] {}';
    const items = val.map(item => jsonToCSharp(item, depth + 1));
    return `new object[] {\n${nextIndent}${items.join(`,\n${nextIndent}`)}\n${currentIndent}}`;
  }

  if (typeof val === 'object') {
    const keys = Object.keys(val);
    if (keys.length === 0) return 'new Dictionary<string, object>()';
    const pairs = keys.map(key => {
      const escapedKey = key.replace(/"/g, '\\"');
      return `{ "${escapedKey}", ${jsonToCSharp(val[key], depth + 1)} }`;
    });
    return `new Dictionary<string, object> {\n${nextIndent}${pairs.join(`,\n${nextIndent}`)}\n${currentIndent}}`;
  }

  return 'null';
}

/** Serialize raw values recursively into a Golang Map/Slice structure */
export function jsonToGo(val: any, depth = 0): string {
  const currentIndent = getIndent(depth);
  const nextIndent = getIndent(depth + 1);

  if (val === null) return 'nil';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') {
    const escaped = val.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    return `"${escaped}"`;
  }

  if (Array.isArray(val)) {
    if (val.length === 0) return '[]interface{}{}';
    const items = val.map(item => jsonToGo(item, depth + 1));
    return `[]interface{}{\n${nextIndent}${items.join(`,\n${nextIndent}`)}\n${currentIndent}}`;
  }

  if (typeof val === 'object') {
    const keys = Object.keys(val);
    if (keys.length === 0) return 'map[string]interface{}{}';
    const pairs = keys.map(key => {
      const escapedKey = key.replace(/"/g, '\\"');
      return `"${escapedKey}": ${jsonToGo(val[key], depth + 1)}`;
    });
    return `map[string]interface{}{\n${nextIndent}${pairs.join(`,\n${nextIndent}`)}\n${currentIndent}}`;
  }

  return 'nil';
}

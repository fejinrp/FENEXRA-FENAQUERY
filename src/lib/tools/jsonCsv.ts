/**
 * Premium Client-Side JSON ↔ CSV Utility (Zero-Dependency)
 * Safely converts between nested JSON array structures and RFC-4180 compliant CSV strings.
 */

/** Helper: Flatten deep objects into dot-notation paths */
export function flattenObject(obj: any, prefix = '', res: Record<string, any> = {}): Record<string, any> {
  if (obj === null || obj === undefined) return res;

  if (Array.isArray(obj)) {
    obj.forEach((val, idx) => {
      flattenObject(val, `${prefix}[${idx}]`, res);
    });
  } else if (typeof obj === 'object' && Object.keys(obj).length > 0) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const nextPrefix = prefix ? `${prefix}.${key}` : key;
        flattenObject(obj[key], nextPrefix, res);
      }
    }
  } else {
    res[prefix] = obj;
  }
  return res;
}

/** Helper: Reconstruct flat dot-notation keys back to a nested object structure */
export function unflattenObject(flatObj: Record<string, any>): any {
  const result: any = {};
  for (const key in flatObj) {
    if (Object.prototype.hasOwnProperty.call(flatObj, key)) {
      const value = flatObj[key];
      const parts = key.split('.');
      let current = result;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part] = value;
        } else {
          if (!current[part]) current[part] = {};
          current = current[part];
        }
      }
    }
  }
  return result;
}

/** Convert a JSON array string to a CSV string */
export function jsonToCsv(jsonInput: string): string {
  let parsed = JSON.parse(jsonInput.trim());
  
  if (!Array.isArray(parsed)) {
    parsed = [parsed]; // standard single-object conversion
  }

  // 1. Flatten all rows
  const flattenedRows = parsed.map((row: any) => flattenObject(row));

  // 2. Collect all unique column headers
  const headersSet = new Set<string>();
  flattenedRows.forEach((row: Record<string, any>) => {
    Object.keys(row).forEach(key => headersSet.add(key));
  });
  const headers = Array.from(headersSet);

  if (headers.length === 0) return '';

  // 3. Reconstruct rows into formatted cells (RFC-4180 compliant escaping)
  const escapeCell = (val: any): string => {
    if (val === null || val === undefined) return '';
    let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    }
    return str;
  };

  const csvRows: string[] = [];
  // Add Header Row
  csvRows.push(headers.map(escapeCell).join(','));

  // Add Data Rows
  flattenedRows.forEach((row: Record<string, any>) => {
    const rowCells = headers.map(h => escapeCell(row[h]));
    csvRows.push(rowCells.join(','));
  });

  return csvRows.join('\r\n');
}

/** Parses a CSV line honoring quoted commas and double quotes (RFC-4180) */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let inQuotes = false;
  let currentVal = '';
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        currentVal += '"';
        i += 2;
      } else {
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(currentVal);
      currentVal = '';
      i++;
    } else {
      currentVal += char;
      i++;
    }
  }
  result.push(currentVal);
  return result;
}

/** Convert a CSV string to a JSON array string */
export function csvToJson(csvInput: string): string {
  const lines = csvInput.trim().split(/\r?\n/);
  if (lines.length === 0 || !lines[0]) return '[]';

  // Extract headers
  const headers = parseCsvLine(lines[0]);
  const jsonRows: any[] = [];

  // Parse type values (cast boolean, numbers, nulls)
  const parseVal = (val: string): any => {
    val = val.trim();
    if (val === '') return null;
    if (val.toLowerCase() === 'true') return true;
    if (val.toLowerCase() === 'false') return false;
    if (val.toLowerCase() === 'null') return null;
    const num = Number(val);
    if (!isNaN(num)) return num;
    return val;
  };

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = parseCsvLine(line);
    const flatObj: Record<string, any> = {};

    headers.forEach((header, colIdx) => {
      const cellVal = cells[colIdx];
      if (cellVal !== undefined) {
        flatObj[header] = parseVal(cellVal);
      }
    });

    jsonRows.push(unflattenObject(flatObj));
  }

  return JSON.stringify(jsonRows, null, 2);
}

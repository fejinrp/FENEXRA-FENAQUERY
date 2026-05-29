// ── Encrypt / Decrypt (Web Crypto API — 100% client-side) ────────────

export type EncMode = 'AES-GCM-256' | 'AES-GCM-128' | 'AES-CBC-256' | 'Base64' | 'ROT13' | 'URL'

function toHex(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function fromHex(hex: string): Uint8Array {
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) arr[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  return arr
}

async function deriveKey(password: string, salt: Uint8Array, bits: 128 | 256, mode: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: mode, length: bits },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptText(text: string, password: string, mode: EncMode): Promise<string> {
  if (mode === 'Base64') return btoa(unescape(encodeURIComponent(text)))
  if (mode === 'ROT13') return text.replace(/[a-zA-Z]/g, c => { const code = c.charCodeAt(0) + 13; return String.fromCharCode((c <= 'Z' ? 90 : 122) >= code ? code : code - 26) })
  if (mode === 'URL') return encodeURIComponent(text)

  const enc = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const algoName = mode.startsWith('AES-GCM') ? 'AES-GCM' : 'AES-CBC'
  const bits = mode.includes('128') ? 128 : 256
  const ivLen = algoName === 'AES-GCM' ? 12 : 16
  const ivActual = algoName === 'AES-GCM' ? iv : crypto.getRandomValues(new Uint8Array(16))
  const key = await deriveKey(password, salt, bits as 128 | 256, algoName)
  const encrypted = await crypto.subtle.encrypt({ name: algoName, iv: ivActual }, key, enc.encode(text))
  // Format: salt(hex) + ":" + iv(hex) + ":" + ciphertext(hex)
  return `${toHex(salt)}:${toHex(ivActual)}:${toHex(encrypted)}`
}

export async function decryptText(cipher: string, password: string, mode: EncMode): Promise<string> {
  if (mode === 'Base64') {
    try { return decodeURIComponent(escape(atob(cipher))) }
    catch { return atob(cipher) }
  }
  if (mode === 'ROT13') return cipher.replace(/[a-zA-Z]/g, c => { const code = c.charCodeAt(0) + 13; return String.fromCharCode((c <= 'Z' ? 90 : 122) >= code ? code : code - 26) })
  if (mode === 'URL') return decodeURIComponent(cipher)

  const parts = cipher.split(':')
  if (parts.length !== 3) throw new Error('Invalid ciphertext format. Expected salt:iv:data')

  const [saltHex, ivHex, ctHex] = parts
  const salt = fromHex(saltHex)
  const iv = fromHex(ivHex)
  const ct = fromHex(ctHex)
  const algoName = mode.startsWith('AES-GCM') ? 'AES-GCM' : 'AES-CBC'
  const bits = mode.includes('128') ? 128 : 256
  const key = await deriveKey(password, salt, bits as 128 | 256, algoName)
  const decrypted = await crypto.subtle.decrypt({ name: algoName, iv: iv.buffer as ArrayBuffer }, key, ct.buffer as ArrayBuffer)
  return new TextDecoder().decode(decrypted)
}

export const ENC_MODES: { value: EncMode; label: string; needsKey: boolean; desc: string }[] = [
  { value: 'AES-GCM-256', label: 'AES-GCM 256-bit', needsKey: true,  desc: 'Most secure. Authenticated encryption.' },
  { value: 'AES-GCM-128', label: 'AES-GCM 128-bit', needsKey: true,  desc: 'Fast AES with authentication tag.' },
  { value: 'AES-CBC-256', label: 'AES-CBC 256-bit', needsKey: true,  desc: 'Classic block cipher mode.' },
  { value: 'Base64',      label: 'Base64',           needsKey: false, desc: 'Encoding only — not encryption.' },
  { value: 'ROT13',       label: 'ROT13',            needsKey: false, desc: 'Classic Caesar shift cipher.' },
  { value: 'URL',         label: 'URL Encode',       needsKey: false, desc: 'Percent-encode for URLs.' },
]

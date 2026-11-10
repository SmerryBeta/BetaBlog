const VERSION = 'A1'
const ITERATIONS = 310000
const SALT_BYTES = 16
const IV_BYTES = 12

export function parseNumericKey(text) {
  const s = text.trim()
  if (!s) throw new Error('Key 不能为空。')

  let n
  if (/^0[xX][0-9a-fA-F]+$/.test(s)) {
    n = BigInt(s)
  } else if (/^[0-9]+$/.test(s)) {
    n = BigInt(s)
  } else {
    throw new Error('Key 只能是十进制数字，或 0x 开头的十六进制数字。')
  }

  // 无符号大整数 → 最短大端字节序；0 特殊处理成一个 00 字节，确保仍可作为 PBKDF2 输入。
  if (n === 0n) return new Uint8Array([0])

  const hex = n.toString(16).padStart(2, '0')
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

// 分块转换，避开 String.fromCharCode 的参数个数上限
function bytesToB64Url(bytes) {
  let bin = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunk, bytes.length)))
  }
  return btoa(bin).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/g, '')
}

function b64UrlToBytes(text) {
  if (!/^[A-Za-z0-9_-]*$/.test(text)) throw new Error('密文 Base64URL 格式错误。')
  const pad = '='.repeat((4 - (text.length % 4)) % 4)
  const b64 = text.replaceAll('-', '+').replaceAll('_', '/') + pad
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function deriveKey(rawKeyBytes, salt) {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    rawKeyBytes,
    'PBKDF2',
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: ITERATIONS,
      hash: 'SHA-256'
    },
    baseKey,
    {
      name: 'AES-GCM',
      length: 256
    },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function enc(msg, key) {
  const rawKey = parseNumericKey(String(key))
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const aesKey = await deriveKey(rawKey, salt)

  const plain = new TextEncoder().encode(String(msg))
  const cipher = new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    aesKey,
    plain
  ))

  return [
    VERSION,
    bytesToB64Url(salt),
    bytesToB64Url(iv),
    bytesToB64Url(cipher)
  ].join('.')
}

export async function dec(ciphertext, key) {
  const raw = parseNumericKey(String(key))
  const parts = String(ciphertext).trim().split('.')
  if (parts.length !== 4 || parts[0] !== VERSION) {
    throw new Error('密文格式不正确，应为 A1.salt.iv.ciphertext。')
  }

  const salt = b64UrlToBytes(parts[1])
  const iv = b64UrlToBytes(parts[2])
  const cipher = b64UrlToBytes(parts[3])

  if (salt.length !== SALT_BYTES) throw new Error('密文 salt 长度错误。')
  if (iv.length !== IV_BYTES) throw new Error('密文 nonce 长度错误。')
  if (cipher.length < 16) throw new Error('密文长度过短。')

  const aesKey = await deriveKey(raw, salt)
  try {
    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      aesKey,
      cipher
    )
    return new TextDecoder().decode(plain)
  } catch {
    throw new Error('解密失败：Key 不正确，或密文已被修改。')
  }
}

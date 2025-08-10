// src/whatsapp.ts
import path from 'path'
import qrcode from 'qrcode-terminal'
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  proto
} from '@whiskeysockets/baileys'

/**
 * Minimal WhatsApp bootstrap that:
 * - stores session files under wa-bot-session
 * - doesn't use makeInMemoryStore()
 * - binds creds.update to saveCreds
 * - exposes a sendMessageWithRetry helper
 */

export async function startWhatsApp() {
  const AUTH_DIR = path.resolve(process.cwd(), 'wa-bot-session')

  // create auth state (multi-file under wa-bot-session)
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR)

  // Try to fetch latest wa-web version safely; if that fails, fallback to a sane default.
  let version: [number, number, number] = [2, 2312, 10]
  try {
    const v = await fetchLatestBaileysVersion?.() // optional safe call
    if (v?.version) version = v.version
  } catch (err) {
    // ignore, use fallback
  }

  // Create socket (pass a valid config object — TS will expect 1 argument)
  const sock = makeWASocket({
    auth: state,
    version,
    browser: ['MacOS', 'SmartDocs-AI', '1.0.0']
  } as any) // 'as any' only if TS complains; remove if not needed

  // Persist creds when they update
  sock.ev.on('creds.update', saveCreds)

  // Connection updates
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update || {}

    if (qr) {
      console.log('QR code received, please scan:')
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'close') {
      const reason = (lastDisconnect?.error as any)?.output?.statusCode || lastDisconnect?.error
      console.warn(`Connection closed, reason: ${reason}`)
    }

    console.log('connection.update', update)
  })

  // Incoming messages
  sock.ev.on('messages.upsert', (m) => {
    console.log('messages.upsert', JSON.stringify(m && Object.keys(m).length ? m : m))
  })

  // Message updates (delivery/read/receipt)
  sock.ev.on('messages.update', (updates) => {
    console.log('messages.update', updates)
  })

  // receipts
  sock.ev.on('message-receipt.update', (u) => {
    console.log('message-receipt.update', u)
  })

  async function sendMessageWithRetry(jid: string, message: any, attempts = 3) {
    let lastErr: any
    for (let i = 1; i <= attempts; i++) {
      try {
        const res = await sock.sendMessage(jid, message)
        console.log('sendMessage success', res)
        return res
      } catch (err) {
        lastErr = err
        console.error(`sendMessage failed attempt ${i}`, err?.toString?.() ?? err)
        if (i === attempts) throw err
        await new Promise(r => setTimeout(r, 1000 * i))
      }
    }
    throw lastErr
  }

  return { sock, sendMessageWithRetry }
} 
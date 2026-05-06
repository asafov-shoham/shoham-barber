/**
 * lib/notifications.ts
 * WhatsApp notifications via Callmebot (admin) and Twilio (customer)
 */

export interface BookingPayload {
  id?: string
  cancelToken?: string
  customerName: string
  customerPhone: string
  serviceName: string
  date: string
  time: string
}

const MONTH_NAMES = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']

function formatHeDate(date: string, time: string): string {
  const [year, month, day] = date.split('-')
  return `${day} ב${MONTH_NAMES[parseInt(month, 10) - 1]} ${year} בשעה ${time}`
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  return digits.startsWith('0') ? '+972' + digits.slice(1) : '+' + digits
}

function cancelUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${base}/cancel/${token}`
}

// ── Twilio helper ─────────────────────────────────────────────────────────────
async function sendTwilio(to: string, body: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken  = process.env.TWILIO_AUTH_TOKEN
  const from       = process.env.TWILIO_WHATSAPP_FROM

  if (!accountSid || !authToken || !from) {
    console.warn('[twilio] env vars not set — skipping')
    return
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ From: from, To: `whatsapp:${to}`, Body: body }).toString(),
    })
    if (!res.ok) console.error('[twilio]', res.status, await res.text())
  } catch (err) {
    console.error('[twilio] fetch failed', err)
  }
}

// ── 1. Notify admin (Callmebot) ───────────────────────────────────────────────
export async function notifyAdmin(booking: BookingPayload): Promise<void> {
  const adminPhone = process.env.ADMIN_WHATSAPP_PHONE
  const apiKey     = process.env.CALLMEBOT_API_KEY

  if (!adminPhone || !apiKey) {
    console.warn('[callmebot] not configured — skipping')
    return
  }

  const msg = encodeURIComponent(
    `📅 תור חדש!\n👤 ${booking.customerName}\n📞 ${booking.customerPhone}\n✂️ ${booking.serviceName}\n🗓 ${formatHeDate(booking.date, booking.time)}`
  )

  try {
    const res = await fetch(`https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${msg}&apikey=${apiKey}`)
    if (!res.ok) console.error('[callmebot]', res.status)
  } catch (err) {
    console.error('[callmebot] failed', err)
  }
}

// ── 2. Customer: booking confirmed ────────────────────────────────────────────
export async function notifyCustomer(booking: BookingPayload): Promise<void> {
  const e164 = normalizePhone(booking.customerPhone)
  const cancelLink = booking.cancelToken ? `\n\n❌ לביטול התור: ${cancelUrl(booking.cancelToken)}` : ''

  const body =
    `שלום ${booking.customerName}! 👋\n\n` +
    `✅ התור שלך אצל ספר שוהם אושר:\n\n` +
    `✂️ שירות: ${booking.serviceName}\n` +
    `📅 תאריך: ${formatHeDate(booking.date, booking.time)}` +
    cancelLink +
    `\n\nנתראה! 💈`

  await sendTwilio(e164, body)
}

// ── 3. Customer: booking approved by barber ───────────────────────────────────
export async function notifyCustomerApproved(booking: BookingPayload): Promise<void> {
  const e164 = normalizePhone(booking.customerPhone)
  const cancelLink = booking.cancelToken ? `\n\n❌ לביטול: ${cancelUrl(booking.cancelToken)}` : ''

  const body =
    `שלום ${booking.customerName}! ✅\n\n` +
    `שוהם אישר את התור שלך:\n\n` +
    `✂️ ${booking.serviceName}\n` +
    `📅 ${formatHeDate(booking.date, booking.time)}` +
    cancelLink +
    `\n\nמצפים לראותך! 💈`

  await sendTwilio(e164, body)
}

// ── 4. Customer: booking rejected by barber ───────────────────────────────────
export async function notifyCustomerRejected(booking: BookingPayload): Promise<void> {
  const e164 = normalizePhone(booking.customerPhone)

  const body =
    `שלום ${booking.customerName},\n\n` +
    `לצערנו לא ניתן לאשר את התור ל-${formatHeDate(booking.date, booking.time)}.\n` +
    `אנא קבע תור חדש באתר או צור קשר ישירות.\n\n` +
    `ספרייה שוהם 💈`

  await sendTwilio(e164, body)
}

// ── 5. Customer: booking cancelled (self-cancel) ──────────────────────────────
export async function notifyCustomerCancelled(booking: BookingPayload): Promise<void> {
  const e164 = normalizePhone(booking.customerPhone)

  const body =
    `שלום ${booking.customerName},\n\n` +
    `✅ ביטול התור שלך ל-${formatHeDate(booking.date, booking.time)} התקבל.\n\n` +
    `אפשר לקבוע תור חדש בכל עת באתר. נשמח לראותך! 💈`

  await sendTwilio(e164, body)
}

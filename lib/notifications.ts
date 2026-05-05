/**
 * lib/notifications.ts
 *
 * WhatsApp notifications via two services:
 *   1. Callmebot  — free, for the BARBER (admin) to receive a ping when a booking arrives.
 *      Setup: send "I allow callmebot to send me messages" to +34 644 59 77 96 on WhatsApp once.
 *      Then add CALLMEBOT_API_KEY to .env (the key they reply with).
 *
 *   2. Twilio WhatsApp sandbox — to send a message TO THE CUSTOMER with booking details.
 *      Setup: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
 *      Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM to .env.
 *      (TWILIO_WHATSAPP_FROM looks like "whatsapp:+14155238886" for the sandbox)
 */

export interface BookingPayload {
  customerName: string
  customerPhone: string   // digits only, e.g. "972501234567"
  serviceName: string
  date: string            // yyyy-MM-dd
  time: string            // HH:MM
}

// ─── Hebrew date helper ──────────────────────────────────────────────────────
function formatHeDate(date: string, time: string): string {
  const [year, month, day] = date.split('-')
  const monthNames = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']
  return `${day} ב${monthNames[parseInt(month, 10) - 1]} ${year} בשעה ${time}`
}

// ─── 1. Notify the barber (Callmebot) ─────────────────────────────────────────
export async function notifyAdmin(booking: BookingPayload): Promise<void> {
  const adminPhone = process.env.ADMIN_WHATSAPP_PHONE   // e.g. "972501234567"
  const apiKey     = process.env.CALLMEBOT_API_KEY

  if (!adminPhone || !apiKey) {
    console.warn('[notifications] ADMIN_WHATSAPP_PHONE or CALLMEBOT_API_KEY not set — skipping admin alert')
    return
  }

  const msg = encodeURIComponent(
    `📅 תור חדש!\n👤 ${booking.customerName}\n📞 ${booking.customerPhone}\n✂️ ${booking.serviceName}\n🗓 ${formatHeDate(booking.date, booking.time)}`
  )

  const url = `https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${msg}&apikey=${apiKey}`

  try {
    const res = await fetch(url)
    if (!res.ok) console.error('[callmebot] non-ok status', res.status)
  } catch (err) {
    console.error('[callmebot] fetch failed', err)
  }
}

// ─── 2. Notify the customer (Twilio) ──────────────────────────────────────────
export async function notifyCustomer(booking: BookingPayload): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken  = process.env.TWILIO_AUTH_TOKEN
  const from       = process.env.TWILIO_WHATSAPP_FROM   // e.g. "whatsapp:+14155238886"

  if (!accountSid || !authToken || !from) {
    console.warn('[notifications] Twilio env vars not set — skipping customer WhatsApp')
    return
  }

  // Normalize customer phone → E.164
  const rawPhone = booking.customerPhone.replace(/\D/g, '')
  const e164 = rawPhone.startsWith('0')
    ? '+972' + rawPhone.slice(1)
    : '+' + rawPhone
  const to = `whatsapp:${e164}`

  const body =
    `שלום ${booking.customerName}! 👋\n\n` +
    `✅ התור שלך אצל ספר שוהם אושר:\n\n` +
    `✂️ שירות: ${booking.serviceName}\n` +
    `📅 תאריך: ${formatHeDate(booking.date, booking.time)}\n\n` +
    `אם ברצונך לבטל או לשנות, צור קשר ישירות.\nנתראה! 💈`

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ From: from, To: to, Body: body }).toString(),
    })
    if (!res.ok) {
      const errText = await res.text()
      console.error('[twilio] non-ok status', res.status, errText)
    }
  } catch (err) {
    console.error('[twilio] fetch failed', err)
  }
}

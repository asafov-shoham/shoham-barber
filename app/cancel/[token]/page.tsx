'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, CalendarOff } from 'lucide-react'

const MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']
function formatHe(date: string, time: string) {
  const [y,m,d] = date.split('-')
  return `${d} ב${MONTHS[parseInt(m)-1]} ${y} בשעה ${time}`
}

type BookingInfo = { name: string; serviceName: string; date: string; time: string; status: string }

export default function CancelPage() {
  const { token } = useParams<{ token: string }>()
  const [info, setInfo] = useState<BookingInfo | null>(null)
  const [state, setState] = useState<'loading'|'ready'|'cancelling'|'done'|'already'|'error'>('loading')

  useEffect(() => {
    fetch(`/api/bookings/cancel/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setState('error'); return }
        setInfo(data)
        setState(data.status === 'CANCELLED' ? 'already' : 'ready')
      })
      .catch(() => setState('error'))
  }, [token])

  const handleCancel = async () => {
    setState('cancelling')
    const res = await fetch(`/api/bookings/cancel/${token}`, { method: 'POST' })
    const data = await res.json()
    if (data.ok) setState('done')
    else if (data.error === 'already_cancelled') setState('already')
    else setState('error')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0A0A0A', direction: 'rtl' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-8 rounded-3xl text-center" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Logo */}
        <div className="text-4xl mb-6">💈</div>

        {state === 'loading' && (
          <>
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#C9A84C' }} />
            <p className="text-white/40">טוען פרטי תור...</p>
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h1 className="text-xl font-semibold mb-2">קישור לא תקין</h1>
            <p className="text-white/40 text-sm">לא ניתן למצוא את התור. ייתכן שהקישור פג תוקף.</p>
          </>
        )}

        {state === 'already' && (
          <>
            <CalendarOff className="w-12 h-12 mx-auto mb-4 text-white/30" />
            <h1 className="text-xl font-semibold mb-2">התור כבר בוטל</h1>
            <p className="text-white/40 text-sm">התור בוטל בעבר.</p>
            <a href="/" className="inline-block mt-6 px-6 py-3 rounded-xl text-sm font-medium" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>קביעת תור חדש</a>
          </>
        )}

        {(state === 'ready' || state === 'cancelling') && info && (
          <>
            <CalendarOff className="w-12 h-12 mx-auto mb-4" style={{ color: '#C9A84C' }} />
            <h1 className="text-xl font-semibold mb-2">ביטול תור</h1>
            <p className="text-white/40 text-sm mb-6">האם לבטל את התור הבא?</p>

            <div className="p-4 rounded-2xl mb-6 text-right space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-sm"><span className="text-white/40">שם: </span>{info.name}</div>
              <div className="text-sm"><span className="text-white/40">שירות: </span>{info.serviceName}</div>
              <div className="text-sm"><span className="text-white/40">מועד: </span>{formatHe(info.date, info.time)}</div>
            </div>

            <button onClick={handleCancel} disabled={state === 'cancelling'} className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 mb-3 transition-all" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}>
              {state === 'cancelling' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              {state === 'cancelling' ? 'מבטל...' : 'כן, בטל את התור'}
            </button>
            <a href="/" className="block py-3 rounded-xl text-sm text-white/40 hover:text-white/60 transition-colors">חזרה לאתר</a>
          </>
        )}

        {state === 'done' && (
          <>
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
            <h1 className="text-xl font-semibold mb-2">התור בוטל בהצלחה</h1>
            <p className="text-white/40 text-sm mb-6">נשלחה אליך הודעת אישור בוואטסאפ.</p>
            <a href="/" className="inline-block px-6 py-3 rounded-xl text-sm font-medium" style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C97D)', color: '#0A0A0A' }}>קביעת תור חדש</a>
          </>
        )}

      </motion.div>
    </div>
  )
}

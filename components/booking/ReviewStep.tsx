'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Scissors, Calendar, Clock, User, Phone, Loader2, CheckCircle2 } from 'lucide-react'
import { BookingFormData, Service } from '@/lib/types'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils'

interface Props { formData: BookingFormData; service?: Service; onSubmit: () => void; onBack: () => void; isSubmitting: boolean }

export default function ReviewStep({ formData, service, onSubmit, onBack, isSubmitting }: Props) {
  const rows = [
    { icon: <Scissors className="w-4 h-4" />, label: 'שירות', value: service?.name || '—', sub: service ? `${formatCurrency(service.price)} · ${service.duration} דק׳` : '' },
    { icon: <Calendar className="w-4 h-4" />, label: 'תאריך', value: formatDate(formData.date) },
    { icon: <Clock className="w-4 h-4" />, label: 'שעה', value: formatTime(formData.time) },
    { icon: <User className="w-4 h-4" />, label: 'שם', value: formData.name },
    { icon: <Phone className="w-4 h-4" />, label: 'טלפון', value: formData.phone },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-3xl sm:text-4xl font-light mb-1.5">סקירה <span style={{ color: '#C9A84C' }}>ואישור</span></h2>
        <p className="text-white/40 text-sm">בדוק את הפרטים לפני האישור הסופי.</p>
      </div>

      <div className="rounded-2xl overflow-hidden mb-4" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-xs font-medium text-white/40">סיכום הזמנה</span>
          <div className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>ממתין לאישור</div>
        </div>
        <div className="p-5 space-y-4">
          {rows.map((row, i) => (
            <motion.div key={row.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,168,76,0.08)', color: '#C9A84C' }}>{row.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white/30 mb-0.5">{row.label}</div>
                <div className="text-sm font-medium text-white/90 truncate">{row.value}</div>
                {row.sub && <div className="text-xs mt-0.5" style={{ color: '#C9A84C' }}>{row.sub}</div>}
              </div>
            </motion.div>
          ))}
        </div>
        {service && (
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(201,168,76,0.03)' }}>
            <span className="text-sm text-white/50">סה״כ לתשלום</span>
            <span className="font-display text-2xl font-semibold" style={{ color: '#E8C97D' }}>{formatCurrency(service.price)}</span>
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl text-xs text-white/40 leading-relaxed mb-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        💬 תקבל אישור בוואטסאפ לאחר ההזמנה. ניתן לבטל עד שעתיים לפני התור.
      </div>

      <div className="flex gap-3">
        <button onClick={onSubmit} disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-70" style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97D)', color: '#0A0A0A', boxShadow: isSubmitting ? 'none' : '0 0 25px rgba(201,168,76,0.3)' }}>
          {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />מאשר...</> : <><CheckCircle2 className="w-4 h-4" />אישור הזמנה</>}
        </button>
        <button onClick={onBack} disabled={isSubmitting} className="flex items-center gap-2 px-5 py-4 rounded-xl text-sm font-medium text-white/50 hover:text-white transition-colors disabled:opacity-30 active:scale-[0.98]" style={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.06)' }}>
          חזור <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

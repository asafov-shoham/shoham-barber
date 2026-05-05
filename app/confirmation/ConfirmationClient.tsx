'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Scissors, Calendar, Clock, User, Phone, CheckCircle2, MessageCircle } from 'lucide-react'
import { Booking } from '@/lib/types'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils'

export default function ConfirmationClient({ booking }: { booking: Booking }) {
  const whatsappMsg = encodeURIComponent(
    `שלום! הזמנתי תור בשוהם ברבר שופ 💈\n\n` +
    `📋 שירות: ${booking.service.name}\n` +
    `📅 תאריך: ${formatDate(booking.date)}\n` +
    `🕐 שעה: ${formatTime(booking.time)}\n` +
    `💰 מחיר: ${formatCurrency(booking.service.price)}\n` +
    `🔖 מספר הזמנה: #${booking.id.slice(-6).toUpperCase()}`
  )

  const rows = [
    { icon: <Scissors className="w-4 h-4" />, label: 'שירות', value: booking.service.name, sub: `${formatCurrency(booking.service.price)} · ${booking.service.duration} דק׳` },
    { icon: <Calendar className="w-4 h-4" />, label: 'תאריך', value: formatDate(booking.date) },
    { icon: <Clock className="w-4 h-4" />, label: 'שעה', value: formatTime(booking.time) },
    { icon: <User className="w-4 h-4" />, label: 'שם', value: booking.name },
    { icon: <Phone className="w-4 h-4" />, label: 'טלפון', value: booking.phone },
  ]

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center px-4 py-12" dir="rtl">
      <div className="w-full max-w-sm">
        {/* Success icon */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="relative inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-5"
            style={{ background: 'rgba(201,168,76,0.1)', border: '2px solid rgba(201,168,76,0.3)' }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              style={{ border: '2px solid rgba(201,168,76,0.35)' }}
            />
            <CheckCircle2 className="w-9 h-9" style={{ color: '#C9A84C' }} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="inline-block text-xs font-medium tracking-widest uppercase mb-3 px-3 py-1.5 rounded-full" style={{ color: '#C9A84C', background: 'rgba(201,168,76,0.1)' }}>
              ההזמנה אושרה ✓
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-light mb-1.5">
              הכל מסודר, <span style={{ color: '#C9A84C' }}>{booking.name.split(' ')[0]}!</span>
            </h1>
            <p className="text-white/40 text-sm">התור שלך נקלט בהצלחה. נתראה בקרוב 💈</p>
          </motion.div>
        </div>

        {/* Booking card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl overflow-hidden mb-4"
          style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97D)' }}>
                <Scissors className="w-3 h-3 text-obsidian" />
              </div>
              <span className="font-display font-semibold text-sm">שוהם ברבר שופ</span>
            </div>
            <span className="text-xs text-white/25 font-mono">#{booking.id.slice(-6).toUpperCase()}</span>
          </div>

          <div className="p-5 space-y-4">
            {rows.map((row, i) => (
              <motion.div key={row.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.06 }} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,168,76,0.08)', color: '#C9A84C' }}>{row.icon}</div>
                <div className="min-w-0">
                  <div className="text-xs text-white/30 mb-0.5">{row.label}</div>
                  <div className="text-sm font-medium text-white/90 truncate">{row.value}</div>
                  {row.sub && <div className="text-xs mt-0.5" style={{ color: '#C9A84C' }}>{row.sub}</div>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="space-y-3">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '972501234567'}?text=${whatsappMsg}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
            style={{ background: '#25D366', color: 'white' }}
          >
            <MessageCircle className="w-4 h-4" />
            שתף בוואטסאפ
          </a>
          <Link href="/book"
            className="flex items-center justify-center w-full py-4 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
          >
            הזמן תור נוסף
          </Link>
          <Link href="/" className="flex items-center justify-center w-full py-3 text-sm text-white/30 hover:text-white/60 transition-colors">
            חזרה לדף הבית
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

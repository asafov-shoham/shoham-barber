'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Check, X, Trash2, ChevronDown } from 'lucide-react'
import { Booking, BookingStatus } from '@/lib/types'
import { formatDate, formatTime, formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils'

interface Props { bookings: Booking[]; onUpdate: (b: Booking[]) => void }
const STATUS_OPTIONS: BookingStatus[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']

export default function BookingsTable({ bookings, onUpdate }: Props) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL')
  const [selected, setSelected] = useState<Booking | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase()
    return (b.name.toLowerCase().includes(q) || b.phone.includes(q) || b.service.name.toLowerCase().includes(q)) &&
      (statusFilter === 'ALL' || b.status === statusFilter)
  })

  const updateStatus = async (id: string, status: BookingStatus) => {
    setLoading(id)
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
      if (res.ok) {
        onUpdate(bookings.map(b => b.id === id ? { ...b, status } : b))
        if (selected?.id === id) setSelected(p => p ? { ...p, status } : null)
      }
    } finally { setLoading(null) }
  }

  const deleteBooking = async (id: string) => {
    if (!confirm('למחוק הזמנה זו?')) return
    setLoading(id)
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
      if (res.ok) { onUpdate(bookings.filter(b => b.id !== id)); if (selected?.id === id) setSelected(null) }
    } finally { setLoading(null) }
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="חפש לפי שם, טלפון או שירות..." className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none text-right" style={{ fontSize: '16px' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['ALL', ...STATUS_OPTIONS] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all flex-shrink-0"
              style={{ background: statusFilter === s ? 'rgba(201,168,76,0.15)' : '#141414', border: statusFilter === s ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.06)', color: statusFilter === s ? '#C9A84C' : 'rgba(255,255,255,0.4)' }}
            >
              {s === 'ALL' ? 'הכל' : getStatusLabel(s)} {s !== 'ALL' && `(${bookings.filter(b => b.status === s).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        {/* Table */}
        <div className="flex-1 rounded-2xl overflow-hidden min-w-0" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-white/30">
              <Search className="w-7 h-7 mx-auto mb-3 opacity-40" />
              <p className="text-sm">לא נמצאו הזמנות.</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              {filtered.map(booking => (
                <motion.div key={booking.id} layout onClick={() => setSelected(booking)}
                  className="flex items-center gap-3 px-4 sm:px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  style={selected?.id === booking.id ? { background: 'rgba(201,168,76,0.04)' } : undefined}
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>
                    {booking.name[0]}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{booking.name}</div>
                    <div className="text-xs text-white/40 truncate">{booking.service.name} · {formatTime(booking.time)}</div>
                    <div className="text-xs text-white/25">{booking.date}</div>
                  </div>
                  {/* Status */}
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                  </div>
                  {/* Quick actions */}
                  <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    {booking.status === 'PENDING' && (
                      <button onClick={() => updateStatus(booking.id, 'CONFIRMED')} disabled={loading === booking.id}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-emerald-500/10 transition-colors" title="אשר">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                    )}
                    {booking.status !== 'CANCELLED' && (
                      <button onClick={() => updateStatus(booking.id, 'CANCELLED')} disabled={loading === booking.id}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors" title="בטל">
                        <X className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel — desktop only */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: -16, width: 0 }} animate={{ opacity: 1, x: 0, width: 280 }} exit={{ opacity: 0, x: -16, width: 0 }}
              transition={{ duration: 0.22 }}
              className="hidden sm:flex flex-shrink-0 flex-col rounded-2xl overflow-hidden"
              style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', height: 'fit-content' }}
            >
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-sm font-medium">פרטי הזמנה</span>
                <button onClick={() => setSelected(null)} className="w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: 'שם', value: selected.name },
                  { label: 'טלפון', value: selected.phone },
                  { label: 'שירות', value: selected.service.name },
                  { label: 'מחיר', value: formatCurrency(selected.service.price) },
                  { label: 'תאריך', value: formatDate(selected.date) },
                  { label: 'שעה', value: formatTime(selected.time) },
                  { label: 'מס׳ הזמנה', value: `#${selected.id.slice(-8).toUpperCase()}` },
                ].map(row => (
                  <div key={row.label}>
                    <div className="text-xs text-white/30 mb-0.5">{row.label}</div>
                    <div className="text-sm font-medium text-white/85">{row.value}</div>
                  </div>
                ))}
                <div>
                  <div className="text-xs text-white/30 mb-1">סטטוס</div>
                  <div className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(selected.status)}`}>{getStatusLabel(selected.status)}</div>
                </div>
                <div className="h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <div className="space-y-2">
                  <div className="text-xs text-white/30 mb-2">עדכן סטטוס</div>
                  {STATUS_OPTIONS.map(status => (
                    <button key={status} onClick={() => updateStatus(selected.id, status)} disabled={selected.status === status || loading === selected.id}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-30"
                      style={{ background: selected.status === status ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.03)', border: selected.status === status ? '1px solid rgba(201,168,76,0.2)' : '1px solid rgba(255,255,255,0.06)', color: selected.status === status ? '#C9A84C' : 'rgba(255,255,255,0.5)' }}
                    >
                      {selected.status === status && <Check className="w-3 h-3" />}
                      סמן כ{getStatusLabel(status)}
                    </button>
                  ))}
                  <button onClick={() => deleteBooking(selected.id)} disabled={loading === selected.id}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all"
                    style={{ border: '1px solid rgba(239,68,68,0.15)' }}>
                    <Trash2 className="w-3 h-3" />מחק הזמנה
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 text-xs text-white/30">מציג {filtered.length} מתוך {bookings.length} הזמנות</div>
    </div>
  )
}

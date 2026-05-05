'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarOff, Clock, Trash2, Plus, Loader2, X, AlertCircle } from 'lucide-react'

interface BlockedSlot {
  id: string
  date: string
  startTime: string | null
  endTime:   string | null
  reason:    string | null
}

const MONTH_NAMES = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']
const DAY_NAMES   = ['א','ב','ג','ד','ה','ו','ש']

function formatHeDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-')
  return `${parseInt(d)} ${MONTH_NAMES[parseInt(m) - 1]} ${y}`
}

function toDateObj(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ─── Mini Calendar ──────────────────────────────────────────────────────────
interface MiniCalendarProps {
  selected: string | null
  onSelect: (date: string) => void
  blockedDates: Set<string>
}

function MiniCalendar({ selected, onSelect, blockedDates }: MiniCalendarProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(v => v - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(v => v + 1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Month nav */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={prevMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all text-lg">‹</button>
        <span className="text-sm font-medium">{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all text-lg">›</button>
      </div>

      {/* Days header */}
      <div className="grid grid-cols-7 px-2 pt-2">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-xs text-white/20 py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5 p-2">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const cellDate = new Date(viewYear, viewMonth, day)
          const isPast = cellDate < today
          const isToday = cellDate.getTime() === today.getTime()
          const isSelected = dateStr === selected
          const isBlocked = blockedDates.has(dateStr)

          return (
            <button
              key={i}
              onClick={() => !isPast && onSelect(dateStr)}
              disabled={isPast}
              className="relative aspect-square w-full flex items-center justify-center text-xs rounded-lg transition-all duration-150"
              style={{
                background: isSelected
                  ? 'rgba(201,168,76,0.2)'
                  : isBlocked
                  ? 'rgba(239,68,68,0.12)'
                  : 'transparent',
                border: isSelected
                  ? '1.5px solid rgba(201,168,76,0.5)'
                  : isToday
                  ? '1.5px solid rgba(255,255,255,0.15)'
                  : '1.5px solid transparent',
                color: isPast
                  ? 'rgba(255,255,255,0.12)'
                  : isSelected
                  ? '#E8C97D'
                  : isBlocked
                  ? 'rgba(239,68,68,0.9)'
                  : 'rgba(255,255,255,0.75)',
                cursor: isPast ? 'not-allowed' : 'pointer',
              }}
            >
              {day}
              {isBlocked && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Panel ─────────────────────────────────────────────────────────────
export default function BlockedDatesPanel() {
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Add form state
  const [addMode, setAddMode] = useState<'day' | 'hours'>('day')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('13:00')
  const [reason, setReason] = useState('')
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/blocked-slots')
      const data = await res.json()
      setBlockedSlots(Array.isArray(data) ? data : [])
    } catch {
      setBlockedSlots([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const blockedDateSet = new Set(blockedSlots.map(s => s.date))

  // Slots for selected date
  const slotsForDate = selectedDate
    ? blockedSlots.filter(s => s.date === selectedDate)
    : []

  const handleAdd = async () => {
    if (!selectedDate) return
    setError(null)

    // Validate
    if (addMode === 'hours' && startTime >= endTime) {
      setError('שעת הסיום חייבת להיות אחרי שעת ההתחלה')
      return
    }

    setAdding(true)
    try {
      const body: Record<string, string> = { date: selectedDate }
      if (addMode === 'hours') {
        body.startTime = startTime
        body.endTime   = endTime
      }
      if (reason.trim()) body.reason = reason.trim()

      const res = await fetch('/api/blocked-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed')
      await load()
      setReason('')
    } catch {
      setError('שגיאה בשמירה. נסה שוב.')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      await fetch(`/api/blocked-slots?id=${id}`, { method: 'DELETE' })
      await load()
    } finally {
      setDeleting(null)
    }
  }

  const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2,'0')}:00`)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-display text-2xl font-medium">ימים וזמנים חסומים</h2>
        <p className="text-xs text-white/30 mt-1">
          בחר תאריך בלוח ואז חסום אותו לכולו או לשעות ספציפיות. הלקוחות לא יוכלו לקבוע תורים בזמנים החסומים.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Calendar ── */}
        <div className="space-y-4">
          <MiniCalendar
            selected={selectedDate}
            onSelect={setSelectedDate}
            blockedDates={blockedDateSet}
          />

          {/* Legend */}
          <div className="flex items-center gap-4 px-1">
            <div className="flex items-center gap-2 text-xs text-white/30">
              <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)' }} />
              יום חסום
            </div>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.5)' }} />
              נבחר
            </div>
          </div>

          {/* All blocked slots list */}
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#C9A84C' }} />
            </div>
          ) : blockedSlots.length === 0 ? (
            <div className="p-5 rounded-2xl text-center text-white/25 text-sm" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.05)' }}>
              <CalendarOff className="w-6 h-6 mx-auto mb-2 opacity-40" />
              אין ימים חסומים כרגע
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="px-4 py-3 text-xs text-white/30" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                כל הזמנים החסומים ({blockedSlots.length})
              </div>
              <div className="divide-y max-h-64 overflow-y-auto" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {blockedSlots.map(slot => (
                  <div key={slot.id} className="px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{formatHeDate(slot.date)}</div>
                      <div className="text-xs text-white/35 flex items-center gap-1 mt-0.5">
                        {slot.startTime && slot.endTime
                          ? <><Clock className="w-3 h-3" /> {slot.startTime} – {slot.endTime}</>
                          : <><CalendarOff className="w-3 h-3" /> יום שלם</>
                        }
                        {slot.reason && <span className="text-white/20"> · {slot.reason}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(slot.id)}
                      disabled={deleting === slot.id}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-white/25 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
                    >
                      {deleting === slot.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Add form ── */}
        <div>
          <AnimatePresence mode="wait">
            {!selectedDate ? (
              <motion.div
                key="no-date"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center py-20 rounded-2xl text-center"
                style={{ background: '#141414', border: '1px dashed rgba(255,255,255,0.08)' }}
              >
                <CalendarOff className="w-10 h-10 mb-4 opacity-20" />
                <div className="text-sm text-white/30">בחר תאריך בלוח כדי לחסום אותו</div>
                <div className="text-xs text-white/15 mt-1">לחץ על יום עתידי</div>
              </motion.div>
            ) : (
              <motion.div
                key={selectedDate}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {/* Date header */}
                <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div className="text-sm font-medium">{formatHeDate(selectedDate)}</div>
                    <div className="text-xs text-white/30 mt-0.5">
                      {slotsForDate.length === 0 ? 'לא חסום' : `${slotsForDate.length} חסימות`}
                    </div>
                  </div>
                  <button onClick={() => setSelectedDate(null)} className="text-white/25 hover:text-white/60 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Existing slots for date */}
                {slotsForDate.length > 0 && (
                  <div className="px-5 py-3 space-y-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {slotsForDate.map(slot => (
                      <div key={slot.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <div className="flex-1 text-xs" style={{ color: 'rgba(239,68,68,0.8)' }}>
                          {slot.startTime && slot.endTime
                            ? `🕐 ${slot.startTime} עד ${slot.endTime}`
                            : '🚫 יום שלם חסום'}
                          {slot.reason && ` — ${slot.reason}`}
                        </div>
                        <button
                          onClick={() => handleDelete(slot.id)}
                          disabled={deleting === slot.id}
                          className="text-white/25 hover:text-red-400 transition-colors"
                        >
                          {deleting === slot.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new block */}
                <div className="p-5 space-y-4">
                  <div className="text-xs text-white/40 font-medium">הוסף חסימה חדשה</div>

                  {/* Mode toggle */}
                  <div className="grid grid-cols-2 gap-2">
                    {(['day','hours'] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => setAddMode(m)}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all"
                        style={{
                          background: addMode === m ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)',
                          border: addMode === m ? '1.5px solid rgba(201,168,76,0.35)' : '1.5px solid rgba(255,255,255,0.07)',
                          color: addMode === m ? '#C9A84C' : 'rgba(255,255,255,0.35)',
                        }}
                      >
                        {m === 'day' ? <><CalendarOff className="w-3.5 h-3.5" /> יום שלם</> : <><Clock className="w-3.5 h-3.5" /> שעות ספציפיות</>}
                      </button>
                    ))}
                  </div>

                  {/* Hour pickers */}
                  {addMode === 'hours' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-white/35 mb-1.5">משעה</label>
                        <select
                          value={startTime}
                          onChange={e => setStartTime(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none appearance-none cursor-pointer"
                          style={{ background: '#0D0D0D', border: '1.5px solid rgba(255,255,255,0.08)' }}
                        >
                          {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-white/35 mb-1.5">עד שעה</label>
                        <select
                          value={endTime}
                          onChange={e => setEndTime(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none appearance-none cursor-pointer"
                          style={{ background: '#0D0D0D', border: '1.5px solid rgba(255,255,255,0.08)' }}
                        >
                          {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* Reason */}
                  <div>
                    <label className="block text-xs text-white/35 mb-1.5">סיבה (אופציונלי)</label>
                    <input
                      type="text"
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      placeholder="לדוגמה: חג, חופשה..."
                      className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none placeholder:text-white/20"
                      style={{ background: '#0D0D0D', border: '1.5px solid rgba(255,255,255,0.08)' }}
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-xl text-xs" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.9)' }}>
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    onClick={handleAdd}
                    disabled={adding}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.01] disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97D)', color: '#0A0A0A' }}
                  >
                    {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {addMode === 'day' ? 'חסום את כל היום' : 'חסום שעות אלו'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

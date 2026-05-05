'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import { he } from 'date-fns/locale'
import { format, parseISO } from 'date-fns'

interface TimeStepProps {
  selected?: string
  date: string
  onSelect: (time: string) => void
  onBack: () => void
}

interface Schedule {
  workingDays: string
  startHour: number
  endHour: number
  slotMinutes: number
}

interface BlockedRange {
  startTime: string | null
  endTime: string | null
}

const DEFAULT_SCHEDULE: Schedule = {
  workingDays: '0,1,2,3,4,5',
  startHour: 9,
  endHour: 19,
  slotMinutes: 30,
}

function generateSlots(startHour: number, endHour: number, intervalMinutes: number): string[] {
  const slots: string[] = []
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += intervalMinutes) {
      const hh = String(hour).padStart(2, '0')
      const mm = String(min).padStart(2, '0')
      slots.push(`${hh}:${mm}`)
    }
  }
  return slots
}

function isSlotInBlockedRange(slot: string, ranges: BlockedRange[]): boolean {
  for (const range of ranges) {
    if (range.startTime && range.endTime && slot >= range.startTime && slot < range.endTime) {
      return true
    }
  }
  return false
}

export default function TimeStep({ selected, date, onSelect, onBack }: TimeStepProps) {
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [blockedRanges, setBlockedRanges] = useState<BlockedRange[]>([])
  const [schedule, setSchedule] = useState<Schedule>(DEFAULT_SCHEDULE)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(selected)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [slotsRes, scheduleRes] = await Promise.all([
          fetch(`/api/bookings/slots?date=${date}`),
          fetch('/api/schedule'),
        ])
        if (slotsRes.ok) {
          const data = await slotsRes.json()
          setBookedSlots(data.bookedSlots || [])
          setBlockedRanges(data.blockedRanges || [])
        }
        if (scheduleRes.ok) {
          const data = await scheduleRes.json()
          setSchedule(data)
        }
      } catch {
        // use defaults
      } finally {
        setLoading(false)
      }
    }
    if (date) fetchData()
  }, [date])

  const formattedDate = date ? format(parseISO(date), 'EEEE, d בMMMM', { locale: he }) : ''
  const allSlots = generateSlots(schedule.startHour, schedule.endHour, schedule.slotMinutes)
  const morningSlots = allSlots.filter((t) => parseInt(t.split(':')[0]) < 12)
  const afternoonSlots = allSlots.filter((t) => parseInt(t.split(':')[0]) >= 12)

  const SlotGroup = ({ label, slots }: { label: string; slots: string[] }) => {
    if (slots.length === 0) return null
    return (
      <div className="mb-6">
        <div className="text-xs font-medium text-white/30 tracking-widest uppercase mb-3">{label}</div>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {slots.map((slot, i) => {
            const isBooked   = bookedSlots.includes(slot)
            const isBlocked  = isSlotInBlockedRange(slot, blockedRanges)
            const isUnavailable = isBooked || isBlocked
            const isSelected = selectedTime === slot
            return (
              <motion.button
                key={slot}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => !isUnavailable && setSelectedTime(slot)}
                disabled={isUnavailable || loading}
                className="py-2.5 px-1 rounded-xl text-xs font-medium transition-all duration-200"
                style={{
                  background: isUnavailable ? 'rgba(255,255,255,0.03)' : isSelected ? 'linear-gradient(135deg, #C9A84C, #E8C97D)' : 'rgba(255,255,255,0.05)',
                  color: isUnavailable ? 'rgba(255,255,255,0.15)' : isSelected ? '#0A0A0A' : 'rgba(255,255,255,0.7)',
                  border: isSelected ? '1px solid transparent' : isUnavailable ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(255,255,255,0.08)',
                  cursor: isUnavailable ? 'not-allowed' : 'pointer',
                  textDecoration: isBooked ? 'line-through' : 'none',
                }}
                whileHover={!isUnavailable ? { scale: 1.05 } : undefined}
                whileTap={!isUnavailable ? { scale: 0.97 } : undefined}
              >
                {loading ? <div className="h-3 w-8 mx-auto rounded shimmer-bg" /> : slot}
              </motion.button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-4xl font-light mb-2">בחר <span style={{ color: '#C9A84C' }}>שעה</span></h2>
        <p className="text-white/40 text-sm">
          שעות פנויות עבור <span className="text-white/60">{formattedDate}</span>. שעות מחוקות — תפוסות.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl mb-6" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
        {loading ? (
          <div className="grid grid-cols-5 gap-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-9 rounded-xl shimmer-bg" style={{ background: 'rgba(255,255,255,0.05)' }} />
            ))}
          </div>
        ) : allSlots.length === 0 ? (
          <p className="text-center text-white/30 text-sm py-8">אין שעות זמינות ביום זה.</p>
        ) : (
          <>
            <SlotGroup label="בוקר" slots={morningSlots} />
            <SlotGroup label="אחר הצהריים" slots={afternoonSlots} />
          </>
        )}
      </motion.div>

      {selectedTime && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl mb-6 text-center" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
          <span className="text-sm font-medium" style={{ color: '#E8C97D' }}>🕐 {selectedTime} — {formattedDate}</span>
        </motion.div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => selectedTime && onSelect(selectedTime)}
          disabled={!selectedTime}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.01]"
          style={{ background: selectedTime ? 'linear-gradient(135deg, #C9A84C, #E8C97D)' : '#1C1C1C', color: selectedTime ? '#0A0A0A' : 'rgba(255,255,255,0.3)' }}
        >
          <ChevronLeft className="w-4 h-4" />
          המשך
        </button>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white transition-colors"
          style={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          חזור <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

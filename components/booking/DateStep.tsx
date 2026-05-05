'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DayPicker } from 'react-day-picker'
import { he } from 'date-fns/locale'
import { format, addDays, startOfDay } from 'date-fns'
import { ArrowRight, ChevronLeft } from 'lucide-react'

interface DateStepProps {
  selected?: string
  onSelect: (date: string) => void
  onBack: () => void
}

interface Schedule {
  workingDays: string
  startHour: number
  endHour: number
  slotMinutes: number
}

export default function DateStep({ selected, onSelect, onBack }: DateStepProps) {
  const today = startOfDay(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    selected ? new Date(selected + 'T00:00:00') : undefined
  )
  const [schedule, setSchedule] = useState<Schedule>({
    workingDays: '0,1,2,3,4,5',
    startHour: 9,
    endHour: 19,
    slotMinutes: 30,
  })
  const [fullyBlockedDates, setFullyBlockedDates] = useState<Date[]>([])

  useEffect(() => {
    fetch('/api/schedule')
      .then((r) => r.json())
      .then((data) => setSchedule(data))
      .catch(() => {})
  }, [])

  // Fetch blocked dates for the next 60 days
  useEffect(() => {
    const from = format(addDays(today, 1), 'yyyy-MM-dd')
    const to   = format(addDays(today, 60), 'yyyy-MM-dd')
    fetch(`/api/blocked-slots?from=${from}&to=${to}`)
      .then(r => r.json())
      .then((slots: { date: string; startTime: string | null; endTime: string | null }[]) => {
        // Dates where the whole day is blocked (no startTime/endTime)
        const fullyBlocked = slots
          .filter(s => !s.startTime && !s.endTime)
          .map(s => new Date(s.date + 'T00:00:00'))
        setFullyBlockedDates(fullyBlocked)
      })
      .catch(() => {})
  }, [])

  const workingDayNums = schedule.workingDays.split(',').map(Number)
  const allDays = [0, 1, 2, 3, 4, 5, 6]
  const offDays = allDays.filter((d) => !workingDayNums.includes(d))

  const handleContinue = () => {
    if (selectedDate) onSelect(format(selectedDate, 'yyyy-MM-dd'))
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-4xl font-light mb-2">בחר <span style={{ color: '#C9A84C' }}>תאריך</span></h2>
        <p className="text-white/40 text-sm">בחר את התאריך המועדף. ימים אפורים — סגור.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-6 rounded-2xl mb-6" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
        <style>{`
          .rdp { margin: 0 auto; direction: rtl; }
          .rdp-months { display: flex; justify-content: center; }
          .rdp-month { width: 100%; }
          .rdp-table { width: 100%; }
          .rdp-day { width: 40px; height: 40px; font-size: 0.875rem; }
          .rdp-head_cell { font-size: 0.7rem; }
        `}</style>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={he}
          disabled={[
            { before: addDays(today, 1) },
            ...(offDays.length > 0 ? [{ dayOfWeek: offDays as (0|1|2|3|4|5|6)[] }] : []),
            ...fullyBlockedDates,
          ]}
          showOutsideDays={false}
          fromDate={addDays(today, 1)}
          toDate={addDays(today, 60)}
        />
      </motion.div>

      {selectedDate && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl mb-6 text-center" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
          <span className="text-sm font-medium" style={{ color: '#E8C97D' }}>
            📅 {format(selectedDate, 'EEEE, d בMMMM yyyy', { locale: he })}
          </span>
        </motion.div>
      )}

      <div className="flex gap-3">
        <button onClick={handleContinue} disabled={!selectedDate} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.01]" style={{ background: selectedDate ? 'linear-gradient(135deg, #C9A84C, #E8C97D)' : '#1C1C1C', color: selectedDate ? '#0A0A0A' : 'rgba(255,255,255,0.3)' }}>
          <ChevronLeft className="w-4 h-4" /> המשך
        </button>
        <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white transition-colors" style={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.06)' }}>
          חזור <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

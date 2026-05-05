'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Check, Loader2, Clock, Calendar } from 'lucide-react'

interface Schedule {
  workingDays: string
  startHour: number
  endHour: number
  slotMinutes: number
}

const DAY_LABELS = [
  { value: 0, label: 'ראשון' },
  { value: 1, label: 'שני' },
  { value: 2, label: 'שלישי' },
  { value: 3, label: 'רביעי' },
  { value: 4, label: 'חמישי' },
  { value: 5, label: 'שישי' },
  { value: 6, label: 'שבת' },
]

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const SLOT_OPTIONS = [15, 20, 30, 45, 60]

export default function SchedulePanel() {
  const [schedule, setSchedule] = useState<Schedule>({
    workingDays: '0,1,2,3,4,5',
    startHour: 9,
    endHour: 19,
    slotMinutes: 30,
  })
  const [original, setOriginal] = useState<Schedule | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/schedule')
      .then((r) => r.json())
      .then((data) => {
        setSchedule(data)
        setOriginal(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const workingDayNums = schedule.workingDays.split(',').map(Number)

  const toggleDay = (day: number) => {
    const current = schedule.workingDays.split(',').map(Number)
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day].sort()
    setSchedule((s) => ({ ...s, workingDays: updated.join(',') }))
  }

  const hasChanges = original ? JSON.stringify(schedule) !== JSON.stringify(original) : false

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/schedule', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule),
      })
      if (res.ok) {
        setOriginal({ ...schedule })
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  // Preview: how many slots per day
  const totalSlots = Math.floor(((schedule.endHour - schedule.startHour) * 60) / schedule.slotMinutes)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A84C' }} />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl font-medium">שעות עבודה</h2>
          <p className="text-xs text-white/30 mt-1">הגדר את הימים והשעות שבהם אתה עובד. הלקוחות יוכלו להזמין רק בזמנים הפעילים.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
          style={{
            background: saved ? 'rgba(52,211,153,0.15)' : 'linear-gradient(135deg, #C9A84C, #E8C97D)',
            color: saved ? 'rgb(52,211,153)' : '#0A0A0A',
            border: saved ? '1px solid rgba(52,211,153,0.3)' : 'none',
          }}
        >
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" />שומר...</>
           : saved   ? <><Check className="w-4 h-4" />נשמר!</>
           : <><Save className="w-4 h-4" />שמור שינויים</>}
        </button>
      </div>

      <div className="space-y-6">
        {/* Working Days */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.08)', color: '#C9A84C' }}>
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium">ימי עבודה</div>
              <div className="text-xs text-white/30">בחר את הימים שבהם הספרייה פתוחה</div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {DAY_LABELS.map((day) => {
              const isActive = workingDayNums.includes(day.value)
              return (
                <button
                  key={day.value}
                  onClick={() => toggleDay(day.value)}
                  className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-[1.03]"
                  style={{
                    background: isActive ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)',
                    border: isActive ? '1.5px solid rgba(201,168,76,0.4)' : '1.5px solid rgba(255,255,255,0.07)',
                    color: isActive ? '#C9A84C' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full transition-all"
                    style={{ background: isActive ? '#C9A84C' : 'rgba(255,255,255,0.15)' }}
                  />
                  {day.label}
                </button>
              )
            })}
          </div>

          <div className="mt-4 text-xs text-white/30 text-center">
            {workingDayNums.length} ימי עבודה בשבוע
          </div>
        </motion.div>

        {/* Working Hours */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.08)', color: '#C9A84C' }}>
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium">שעות עבודה</div>
              <div className="text-xs text-white/30">הגדר מאיזו שעה עד איזו שעה מקבלים תורים</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Start Hour */}
            <div>
              <label className="block text-xs text-white/40 mb-2">שעת פתיחה</label>
              <select
                value={schedule.startHour}
                onChange={(e) => setSchedule((s) => ({ ...s, startHour: Number(e.target.value) }))}
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none appearance-none cursor-pointer"
                style={{ background: '#0D0D0D', border: '1.5px solid rgba(255,255,255,0.08)' }}
              >
                {HOURS.filter((h) => h < schedule.endHour).map((h) => (
                  <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>
                ))}
              </select>
            </div>

            {/* End Hour */}
            <div>
              <label className="block text-xs text-white/40 mb-2">שעת סגירה</label>
              <select
                value={schedule.endHour}
                onChange={(e) => setSchedule((s) => ({ ...s, endHour: Number(e.target.value) }))}
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none appearance-none cursor-pointer"
                style={{ background: '#0D0D0D', border: '1.5px solid rgba(255,255,255,0.08)' }}
              >
                {HOURS.filter((h) => h > schedule.startHour).map((h) => (
                  <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>
                ))}
              </select>
            </div>
          </div>

          {/* Slot Duration */}
          <div>
            <label className="block text-xs text-white/40 mb-2">משך זמן לכל תור</label>
            <div className="grid grid-cols-5 gap-2">
              {SLOT_OPTIONS.map((min) => (
                <button
                  key={min}
                  onClick={() => setSchedule((s) => ({ ...s, slotMinutes: min }))}
                  className="py-2.5 rounded-xl text-xs font-medium transition-all"
                  style={{
                    background: schedule.slotMinutes === min ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)',
                    border: schedule.slotMinutes === min ? '1.5px solid rgba(201,168,76,0.4)' : '1.5px solid rgba(255,255,255,0.07)',
                    color: schedule.slotMinutes === min ? '#C9A84C' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {min} דק׳
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="p-5 rounded-xl" style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)' }}>
          <div className="text-xs text-white/40 mb-2">תצוגה מקדימה</div>
          <div className="text-sm" style={{ color: '#C9A84C' }}>
            {String(schedule.startHour).padStart(2,'0')}:00 – {String(schedule.endHour).padStart(2,'0')}:00
            &nbsp;·&nbsp; {totalSlots} תורים ביום
            &nbsp;·&nbsp; {workingDayNums.length} ימים בשבוע
          </div>
          <div className="text-xs text-white/30 mt-1">
            = עד {totalSlots * workingDayNums.length} תורים בשבוע
          </div>
        </motion.div>
      </div>
    </div>
  )
}

'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, parseISO, subDays } from 'date-fns'
import { he } from 'date-fns/locale'
import { Booking, Service } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface Props { bookings: Booking[]; services: Service[] }

const GOLD = ['#C9A84C', '#E8C97D', '#A67C30', '#D4B870', '#8B6520']

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl text-xs" style={{ background: '#1C1C1C', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="text-white/50 mb-1">{label}</div>
        <div style={{ color: '#C9A84C' }}>{payload[0].value} הזמנות</div>
      </div>
    )
  }
  return null
}

export default function AnalyticsPanel({ bookings, services }: Props) {
  const bookingsByDay = useMemo(() => {
    const days: Record<string, number> = {}
    for (let i = 13; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'yyyy-MM-dd')
      days[d] = 0
    }
    bookings.forEach((b) => { if (days[b.date] !== undefined) days[b.date]++ })
    return Object.entries(days).map(([date, count]) => ({
      date: format(parseISO(date), 'd/M', { locale: he }),
      הזמנות: count,
    }))
  }, [bookings])

  const servicePopularity = useMemo(() => {
    const counts: Record<string, { name: string; count: number }> = {}
    bookings.forEach((b) => {
      if (!counts[b.serviceId]) counts[b.serviceId] = { name: b.service.name, count: 0 }
      counts[b.serviceId].count++
    })
    return Object.values(counts).sort((a, b) => b.count - a.count)
  }, [bookings])

  const peakHours = useMemo(() => {
    const hours: Record<string, number> = {}
    for (let h = 9; h < 19; h++) hours[`${String(h).padStart(2, '0')}:00`] = 0
    bookings.forEach((b) => { const hour = b.time.split(':')[0] + ':00'; if (hours[hour] !== undefined) hours[hour]++ })
    return Object.entries(hours).map(([time, count]) => ({ time, הזמנות: count }))
  }, [bookings])

  const totalRevenue = bookings.filter((b) => b.status === 'COMPLETED').reduce((sum, b) => sum + b.service.price, 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: 'סה״כ הכנסות', value: formatCurrency(totalRevenue), note: 'תורים שהושלמו' },
          { label: 'ממוצע יומי', value: (bookings.length / 14).toFixed(1), note: '14 הימים האחרונים' },
          { label: 'שירות מוביל', value: servicePopularity[0]?.name || '—', note: `${servicePopularity[0]?.count || 0} הזמנות` },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs text-white/30 mb-2">{card.label}</div>
            <div className="font-display text-2xl font-semibold mb-1 truncate">{card.value}</div>
            <div className="text-xs" style={{ color: '#C9A84C' }}>{card.note}</div>
          </motion.div>
        ))}
      </div>

      {/* Bookings over time */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="font-display text-lg font-medium mb-6">הזמנות — 14 הימים האחרונים</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={bookingsByDay} barCategoryGap="30%">
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} width={20} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="הזמנות" fill="#C9A84C" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {/* Peak Hours */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="font-display text-lg font-medium mb-6">שעות שיא</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={peakHours} barCategoryGap="30%">
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} width={20} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="הזמנות" fill="rgba(201,168,76,0.6)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Service Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="font-display text-lg font-medium mb-6">פופולריות שירותים</h3>
          {servicePopularity.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-white/30 text-sm">אין נתונים עדיין</div>
          ) : (
            <div className="space-y-3">
              {servicePopularity.map((service, i) => {
                const pct = bookings.length ? Math.round((service.count / bookings.length) * 100) : 0
                return (
                  <div key={service.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-white/40 ml-2">{service.count} × ({pct}%)</span>
                      <span className="text-sm text-white/70 truncate">{service.name}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }} style={{ background: GOLD[i % GOLD.length] }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

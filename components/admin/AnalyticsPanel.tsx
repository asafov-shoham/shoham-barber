'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { format, parseISO, subDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { he } from 'date-fns/locale'
import { TrendingUp, TrendingDown, Users, Scissors, Clock, Repeat2 } from 'lucide-react'
import { Booking, Service } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface Props { bookings: Booking[]; services: Service[] }

const GOLD = ['#C9A84C','#E8C97D','#A67C30','#D4B870','#8B6520','#F0D98A']

function StatCard({ label, value, sub, icon, trend }: { label: string; value: string; sub?: string; icon: React.ReactNode; trend?: number }) {
  return (
    <div className="p-5 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>{icon}</div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 text-xs" style={{ color: trend >= 0 ? '#22c55e' : '#ef4444' }}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-semibold mb-0.5">{value}</div>
      <div className="text-xs text-white/35">{label}</div>
      {sub && <div className="text-xs text-white/20 mt-0.5">{sub}</div>}
    </div>
  )
}

const Tip = ({ active, payload, label, suffix = '' }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-xl text-xs" style={{ background: '#1C1C1C', border: '1px solid rgba(201,168,76,0.2)' }}>
      <div className="text-white/50 mb-1">{label}</div>
      <div style={{ color: '#C9A84C' }}>{payload[0].value}{suffix}</div>
    </div>
  )
}

export default function AnalyticsPanel({ bookings, services }: Props) {
  const active = bookings.filter(b => b.status !== 'CANCELLED')
  const now = new Date()

  // ── Revenue helpers ─────────────────────────────────────────────────────────
  const revenue = (list: Booking[]) => list.reduce((s, b) => s + (b.service?.price ?? 0), 0)

  // ── This month vs last month ─────────────────────────────────────────────────
  const thisMonthRange = { start: startOfMonth(now), end: endOfMonth(now) }
  const lastMonthRange = { start: startOfMonth(subDays(startOfMonth(now), 1)), end: endOfMonth(subDays(startOfMonth(now), 1)) }

  const thisMonthBookings = active.filter(b => isWithinInterval(parseISO(b.date), thisMonthRange))
  const lastMonthBookings = active.filter(b => isWithinInterval(parseISO(b.date), lastMonthRange))

  const thisMonthRev = revenue(thisMonthBookings)
  const lastMonthRev = revenue(lastMonthBookings)
  const revTrend = lastMonthRev > 0 ? Math.round(((thisMonthRev - lastMonthRev) / lastMonthRev) * 100) : 0

  const thisMonthCount = thisMonthBookings.length
  const lastMonthCount = lastMonthBookings.length
  const countTrend = lastMonthCount > 0 ? Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100) : 0

  // ── Avg ticket ──────────────────────────────────────────────────────────────
  const avgTicket = active.length > 0 ? revenue(active) / active.length : 0

  // ── Repeat customers ────────────────────────────────────────────────────────
  const phoneCounts = active.reduce((acc, b) => { acc[b.phone] = (acc[b.phone] || 0) + 1; return acc }, {} as Record<string, number>)
  const repeatCustomers = Object.values(phoneCounts).filter(c => c > 1).length
  const totalCustomers = Object.keys(phoneCounts).length
  const retentionRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0

  // ── Daily revenue last 14 days ───────────────────────────────────────────────
  const dailyRevenue = useMemo(() => {
    const days: Record<string, number> = {}
    for (let i = 13; i >= 0; i--) {
      const d = format(subDays(now, i), 'yyyy-MM-dd')
      days[d] = 0
    }
    active.forEach(b => { if (days[b.date] !== undefined) days[b.date] += b.service?.price ?? 0 })
    return Object.entries(days).map(([date, rev]) => ({
      date: format(parseISO(date), 'd/M', { locale: he }),
      הכנסה: rev,
    }))
  }, [bookings])

  // ── Service breakdown ────────────────────────────────────────────────────────
  const serviceStats = useMemo(() => {
    const map: Record<string, { name: string; count: number; revenue: number }> = {}
    active.forEach(b => {
      if (!map[b.serviceId]) map[b.serviceId] = { name: b.service?.name ?? '', count: 0, revenue: 0 }
      map[b.serviceId].count++
      map[b.serviceId].revenue += b.service?.price ?? 0
    })
    return Object.values(map).sort((a, b) => b.revenue - a.revenue)
  }, [bookings])

  // ── Peak hours ───────────────────────────────────────────────────────────────
  const peakHours = useMemo(() => {
    const hours: Record<number, number> = {}
    for (let h = 8; h <= 19; h++) hours[h] = 0
    active.forEach(b => {
      const h = parseInt(b.time.split(':')[0])
      if (hours[h] !== undefined) hours[h]++
    })
    return Object.entries(hours).map(([h, count]) => ({ שעה: `${h}:00`, תורים: count }))
  }, [bookings])

  // ── Day of week ──────────────────────────────────────────────────────────────
  const dayNames = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת']
  const byDay = useMemo(() => {
    const days = Array(7).fill(0)
    active.forEach(b => { days[parseISO(b.date).getDay()]++ })
    return days.map((count, i) => ({ יום: dayNames[i], תורים: count }))
  }, [bookings])

  // ── Best service ─────────────────────────────────────────────────────────────
  const bestService = serviceStats[0]

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-medium">אנליטיקה חכמה</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="הכנסות החודש" value={`₪${thisMonthRev.toLocaleString()}`} sub={`החודש שעבר: ₪${lastMonthRev.toLocaleString()}`} icon={<span className="text-base">₪</span>} trend={revTrend} />
        <StatCard label="תורים החודש" value={String(thisMonthCount)} sub={`החודש שעבר: ${lastMonthCount}`} icon={<Scissors className="w-4 h-4" />} trend={countTrend} />
        <StatCard label="ממוצע לתור" value={`₪${Math.round(avgTicket)}`} sub="על פני כל ההיסטוריה" icon={<TrendingUp className="w-4 h-4" />} />
        <StatCard label="לקוחות חוזרים" value={`${retentionRate}%`} sub={`${repeatCustomers} מתוך ${totalCustomers} לקוחות`} icon={<Repeat2 className="w-4 h-4" />} />
        <StatCard label="סה״כ לקוחות" value={String(totalCustomers)} sub="לקוחות ייחודיים" icon={<Users className="w-4 h-4" />} />
        <StatCard label="שירות מוביל" value={bestService?.name ?? '—'} sub={bestService ? `₪${bestService.revenue.toLocaleString()} הכנסות` : ''} icon={<Scissors className="w-4 h-4" />} />
      </div>

      {/* Revenue chart */}
      <div className="p-5 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-sm font-medium mb-4 text-white/70">הכנסות — 14 ימים אחרונים</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={dailyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₪${v}`} />
            <Tooltip content={<Tip suffix=" ₪" />} />
            <Line type="monotone" dataKey="הכנסה" stroke="#C9A84C" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Peak hours */}
        <div className="p-5 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-sm font-medium mb-4 text-white/70">שעות עומס</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={peakHours}>
              <XAxis dataKey="שעה" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<Tip />} />
              <Bar dataKey="תורים" fill="#C9A84C" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By day of week */}
        <div className="p-5 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-sm font-medium mb-4 text-white/70">תורים לפי יום שבוע</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={byDay}>
              <XAxis dataKey="יום" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<Tip />} />
              <Bar dataKey="תורים" fill="#A67C30" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service breakdown table */}
      {serviceStats.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-5 py-4 text-sm font-medium text-white/70" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>פירוט לפי שירות</div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {serviceStats.map((s, i) => {
              const maxRev = serviceStats[0].revenue
              const pct = maxRev > 0 ? (s.revenue / maxRev) * 100 : 0
              return (
                <div key={s.name} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: GOLD[i % GOLD.length] }} />
                      <span className="text-sm font-medium">{s.name}</span>
                    </div>
                    <div className="text-sm text-white/50">{s.count} תורים · <span style={{ color: '#C9A84C' }}>₪{s.revenue.toLocaleString()}</span></div>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: GOLD[i % GOLD.length] }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

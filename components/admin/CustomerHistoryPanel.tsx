'use client'

import { useMemo, useState } from 'react'
import { Search, Phone, Scissors, Calendar, TrendingUp } from 'lucide-react'
import { Booking } from '@/lib/types'

interface Props { bookings: Booking[] }

interface Customer {
  name: string
  phone: string
  visits: number
  totalSpent: number
  lastVisit: string
  firstVisit: string
  services: string[]
  cancelRate: number
  bookings: Booking[]
}

export default function CustomerHistoryPanel({ bookings }: Props) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Customer | null>(null)

  const customers = useMemo<Customer[]>(() => {
    const map: Record<string, Customer> = {}
    bookings.forEach(b => {
      if (!map[b.phone]) {
        map[b.phone] = {
          name: b.name,
          phone: b.phone,
          visits: 0,
          totalSpent: 0,
          lastVisit: b.date,
          firstVisit: b.date,
          services: [],
          cancelRate: 0,
          bookings: [],
        }
      }
      const c = map[b.phone]
      c.bookings.push(b)
      if (b.status !== 'CANCELLED') {
        c.visits++
        c.totalSpent += b.service?.price ?? 0
      }
      if (!c.services.includes(b.service?.name)) c.services.push(b.service?.name)
      if (b.date > c.lastVisit) c.lastVisit = b.date
      if (b.date < c.firstVisit) c.firstVisit = b.date
    })

    return Object.values(map).map(c => ({
      ...c,
      cancelRate: c.bookings.length > 0
        ? Math.round((c.bookings.filter(b => b.status === 'CANCELLED').length / c.bookings.length) * 100)
        : 0,
    })).sort((a, b) => b.visits - a.visits)
  }, [bookings])

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  )

  const MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']
  function formatHe(date: string) {
    const [y,m,d] = date.split('-')
    return `${parseInt(d)} ${MONTHS[parseInt(m)-1]} ${y}`
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-medium">היסטוריית לקוחות</h2>
        <p className="text-xs text-white/30 mt-1">{customers.length} לקוחות ייחודיים</p>
      </div>

      <div className="flex gap-4">
        {/* List */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Search */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="חפש לפי שם או טלפון..." className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none text-right" style={{ fontSize: '16px' }} />
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
            {filtered.length === 0 ? (
              <div className="p-10 text-center text-white/30 text-sm">לא נמצאו לקוחות</div>
            ) : (
              <div className="divide-y max-h-[60vh] overflow-y-auto" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {filtered.map(c => (
                  <div key={c.phone} onClick={() => setSelected(c)} className="px-5 py-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer" style={selected?.phone === c.phone ? { background: 'rgba(201,168,76,0.04)' } : {}}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>
                      {c.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-xs text-white/35">{c.phone}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-medium" style={{ color: '#C9A84C' }}>₪{c.totalSpent.toLocaleString()}</div>
                      <div className="text-xs text-white/35">{c.visits} ביקורים</div>
                    </div>
                    {c.visits > 2 && (
                      <div className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
                        נאמן
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-72 flex-shrink-0 rounded-2xl overflow-hidden" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-semibold" style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}>
                  {selected.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium">{selected.name}</div>
                  <div className="text-xs text-white/35">{selected.phone}</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 p-4">
              {[
                { icon: <Scissors className="w-3.5 h-3.5" />, label: 'ביקורים', value: String(selected.visits) },
                { icon: <TrendingUp className="w-3.5 h-3.5" />, label: 'סה״כ הוצאה', value: `₪${selected.totalSpent.toLocaleString()}` },
                { icon: <Calendar className="w-3.5 h-3.5" />, label: 'ביקור אחרון', value: formatHe(selected.lastVisit) },
                { icon: <Calendar className="w-3.5 h-3.5" />, label: 'לקוח מאז', value: formatHe(selected.firstVisit) },
              ].map(stat => (
                <div key={stat.label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-1.5 mb-1 text-white/30">{stat.icon}<span className="text-xs">{stat.label}</span></div>
                  <div className="text-sm font-medium">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Services */}
            <div className="px-4 pb-3">
              <div className="text-xs text-white/30 mb-2">שירותים</div>
              <div className="flex flex-wrap gap-1.5">
                {selected.services.map(s => (
                  <span key={s} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(201,168,76,0.08)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.15)' }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Booking history */}
            <div className="px-4 pb-4">
              <div className="text-xs text-white/30 mb-2">היסטוריית ביקורים</div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selected.bookings.sort((a,b) => b.date.localeCompare(a.date)).map(b => (
                  <div key={b.id} className="flex items-center justify-between text-xs">
                    <div className="text-white/50">{formatHe(b.date)} {b.time}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/30">{b.service?.name}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        b.status === 'COMPLETED' ? 'text-emerald-400' :
                        b.status === 'CANCELLED' ? 'text-red-400' :
                        b.status === 'CONFIRMED' ? 'text-blue-400' : 'text-yellow-400'
                      }`}>
                        {b.status === 'COMPLETED' ? '✓' : b.status === 'CANCELLED' ? '✗' : b.status === 'CONFIRMED' ? '✓' : '⏳'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

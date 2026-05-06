'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scissors, Calendar, TrendingUp, Clock, BarChart3, Home, Users, FileText, Menu, X, LogOut, CalendarOff } from 'lucide-react'
import { Booking, Service } from '@/lib/types'
import { formatTime, formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils'
import BookingsTable from './BookingsTable'
import AnalyticsPanel from './AnalyticsPanel'
import ServicesPanel from './ServicesPanel'
import ContentEditor from './ContentEditor'
import SchedulePanel from './SchedulePanel'
import BlockedDatesPanel from './BlockedDatesPanel'
import CustomerHistoryPanel from './CustomerHistoryPanel'

interface Props {
  initialBookings: Booking[]
  initialServices: Service[]
  stats: { todayCount: number; todayRevenue: number; totalBookings: number; pendingCount: number }
}

type ActiveTab = 'overview' | 'bookings' | 'services' | 'schedule' | 'blocked' | 'analytics' | 'customers' | 'content'

export default function AdminDashboard({ initialBookings, initialServices, stats }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview')
  const [bookings, setBookings] = useState(initialBookings)
  const [services, setServices] = useState(initialServices)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview',  label: 'סקירה כללית',  icon: <Home className="w-4 h-4" /> },
    { id: 'bookings',  label: 'הזמנות',        icon: <Calendar className="w-4 h-4" /> },
    { id: 'services',  label: 'שירותים',        icon: <Scissors className="w-4 h-4" /> },
    { id: 'schedule',  label: 'שעות עבודה',    icon: <Clock className="w-4 h-4" /> },
    { id: 'blocked',   label: 'ימים חסומים',    icon: <CalendarOff className="w-4 h-4" /> },
    { id: 'analytics', label: 'אנליטיקה',       icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'customers', label: 'לקוחות',          icon: <Users className="w-4 h-4" /> },
    { id: 'content',   label: 'עריכת תכנים',   icon: <FileText className="w-4 h-4" /> },
  ]

  const tabLabels: Record<ActiveTab, string> = {
    overview: 'סקירה כללית', bookings: 'הזמנות', services: 'שירותים',
    schedule: 'שעות עבודה', blocked: 'ימים חסומים', analytics: 'אנליטיקה', customers: 'לקוחות', content: 'עריכת תכנים',
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    window.location.href = '/admin/login'
  }

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab)
    setSidebarOpen(false)
  }

  const SidebarContent = () => (
    <>
      <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97D)' }}>
          <Scissors className="w-4 h-4 text-obsidian" />
        </div>
        <div>
          <div className="font-display font-semibold text-sm">שוהם</div>
          <div className="text-xs text-white/30">פאנל ניהול</div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <button key={item.id} onClick={() => handleTabChange(item.id)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: activeTab === item.id ? 'rgba(201,168,76,0.1)' : 'transparent',
              color: activeTab === item.id ? '#C9A84C' : 'rgba(255,255,255,0.45)',
              border: activeTab === item.id ? '1px solid rgba(201,168,76,0.2)' : '1px solid transparent',
            }}
          >
            {item.icon}
            {item.label}
            {item.id === 'bookings' && stats.pendingCount > 0 && (
              <span className="mr-auto text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: '#C9A84C', color: '#0A0A0A' }}>
                {stats.pendingCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 transition-colors">
          <Home className="w-4 h-4" />צפה באתר
        </a>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 transition-colors">
          <LogOut className="w-4 h-4" />יציאה
        </button>
      </div>
    </>
  )

  const todayBookings = bookings.filter(b => b.date === new Date().toISOString().split('T')[0])
  const statCards = [
    { label: 'תורים היום',      value: stats.todayCount,                  icon: <Calendar className="w-5 h-5" />,   positive: true,  note: 'סה״כ לתאריך' },
    { label: 'הכנסה היום',      value: formatCurrency(stats.todayRevenue), icon: <TrendingUp className="w-5 h-5" />, positive: true,  note: 'הושלמו' },
    { label: 'סה״כ הזמנות',    value: stats.totalBookings,               icon: <Users className="w-5 h-5" />,      positive: true,  note: 'מאז הפתיחה' },
    { label: 'ממתינים',         value: stats.pendingCount,                icon: <Clock className="w-5 h-5" />,      positive: false, note: 'דורשים טיפול' },
  ]

  return (
    <div className="min-h-screen bg-obsidian text-white flex" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', background: '#0D0D0D' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0,0,0,0.7)' }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-72 z-50 flex flex-col md:hidden"
              style={{ background: '#0D0D0D', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 overflow-auto min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between gap-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg text-white/50 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-lg sm:text-xl font-semibold">{tabLabels[activeTab]}</h1>
              <p className="text-xs text-white/30 hidden sm:block">
                {new Date().toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs" style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.25)' }}>
              ש
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-8">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
                {statCards.map((card, i) => (
                  <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className="p-4 sm:p-6 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center mb-3 sm:mb-4" style={{ background: 'rgba(201,168,76,0.08)', color: '#C9A84C' }}>
                      {card.icon}
                    </div>
                    <div className="font-display text-xl sm:text-2xl font-semibold mb-0.5">{card.value}</div>
                    <div className="text-xs text-white/40">{card.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: card.positive ? 'rgba(52,211,153,0.7)' : 'rgba(251,191,36,0.7)' }}>{card.note}</div>
                  </motion.div>
                ))}
              </div>

              {/* Today's bookings */}
              <div className="rounded-2xl overflow-hidden" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="px-4 sm:px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <h2 className="font-display text-base sm:text-lg font-medium">תורים להיום</h2>
                  <button onClick={() => setActiveTab('bookings')} className="text-xs text-white/40 hover:text-white/70 transition-colors">← הצג הכל</button>
                </div>
                {todayBookings.length === 0 ? (
                  <div className="p-10 text-center text-white/30">
                    <Calendar className="w-7 h-7 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">אין תורים להיום.</p>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    {todayBookings.slice(0, 8).map(b => (
                      <div key={b.id} className="px-4 sm:px-6 py-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>{b.name[0]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{b.name}</div>
                          <div className="text-xs text-white/40 truncate">{b.service.name}</div>
                        </div>
                        <div className="text-sm text-white/60 flex-shrink-0">{formatTime(b.time)}</div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 hidden sm:block ${getStatusColor(b.status)}`}>
                          {getStatusLabel(b.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'bookings'  && <BookingsTable bookings={bookings} onUpdate={setBookings} />}
          {activeTab === 'services'  && <ServicesPanel services={services} onUpdate={setServices} />}
          {activeTab === 'schedule'  && <SchedulePanel />}
          {activeTab === 'blocked'   && <BlockedDatesPanel />}
          {activeTab === 'analytics' && <AnalyticsPanel bookings={bookings} services={services} />}
          {activeTab === 'customers' && <CustomerHistoryPanel bookings={bookings} />}
          {activeTab === 'content'   && <ContentEditor />}
        </div>
      </main>
    </div>
  )
}

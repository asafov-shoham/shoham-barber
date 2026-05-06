'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Scissors, Clock, MapPin, Phone, ChevronLeft, Instagram } from 'lucide-react'
import { Service } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

const SERVICE_ICONS: Record<string, string> = {
  'תספורת קלאסית': '✂️', 'פייד חתימה': '💈', 'עיצוב זקן': '🪒', 'חבילת הפינוק המלאה': '👑',
}

const DEFAULT_CONTENT: Record<string, string> = {
  hero_badge: 'ספר גברים מצפה רמון',
  hero_main: 'כל תספורת היא יצירה, וכל ביקור הוא חוויה',
  hero_cta_primary: 'הזמן תור עכשיו',
  hero_cta_secondary: 'לצפייה בשירותים',
  stat_clients: '+50', stat_clients_label: 'לקוחות מרוצים',
  services_title: 'השירותים שלנו', services_cta: 'הזמן כל שירות',
  location_title: 'בוא לבקר',
  location_desc: 'אנחנו ממוקמים בלב מצפה רמון. בואו ספונטנית או הזמינו תור מראש.',
  address: 'רחוב הראשי 1, מצפה רמון',
  hours: 'ראשון–חמישי: 09:00–19:00\nשישי: 09:00–15:00\nשבת: סגור',
  phone: '050-123-4567',
  cta_title: 'מוכן להיראות במיטבך?',
  cta_subtitle: 'הזמן תור תוך פחות מדקה. ללא צורך בחשבון.',
  cta_button: 'הזמן עכשיו — בחינם', footer_name: 'שוהם ברבר שופ',
}

export default function LandingPage() {
  const [content, setContent] = useState<Record<string, string>>(DEFAULT_CONTENT)
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(true)

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(data => {
      if (data && typeof data === 'object') setContent(p => ({ ...p, ...data }))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(data => {
      setServices(Array.isArray(data) ? data : [])
    }).catch(() => {}).finally(() => setLoadingServices(false))
  }, [])

  const c = (k: string) => content[k] ?? DEFAULT_CONTENT[k] ?? ''

  return (
    <div className="min-h-screen bg-obsidian text-white overflow-x-hidden" dir="rtl">
      {/* Nav */}
      <nav className="fixed top-0 right-0 left-0 z-50 px-4 sm:px-6 py-4" style={{ background: 'linear-gradient(180deg, rgba(10,10,10,0.97) 0%, transparent 100%)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97D)' }}>
              <Scissors className="w-4 h-4 text-obsidian" />
            </div>
            <span className="font-display text-lg sm:text-xl font-semibold">{c('footer_name')}</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm text-white/60 hover:text-white transition-colors">שירותים</a>
            <a href="#location" className="text-sm text-white/60 hover:text-white transition-colors">מיקום</a>
          </div>
          <Link href="/book"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97D)', color: '#0A0A0A' }}
          >
            הזמן תור
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.12) 0%, rgba(10,10,10,0) 65%)' }} />

        <div className="relative z-10 text-center w-full max-w-2xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide mb-8"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C' }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C9A84C' }} />
            {c('hero_badge')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8 }}
            className="font-display font-light leading-[1.15] mb-8"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}
          >
            <span style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #E8C97D 50%, #C9A84C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {c('hero_main')}
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/book"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97D)', color: '#0A0A0A', boxShadow: '0 0 30px rgba(201,168,76,0.3)' }}
            >
              {c('hero_cta_primary')} <ChevronLeft className="w-4 h-4" />
            </Link>
            <a href="#services"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-full font-medium text-base border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all duration-300 active:scale-95"
            >
              {c('hero_cta_secondary')}
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-16 flex justify-center">
            <div className="text-center">
              <div className="font-display text-3xl font-semibold" style={{ color: '#C9A84C' }}>{c('stat_clients')}</div>
              <div className="text-xs text-white/40 mt-1">{c('stat_clients_label')}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-16">
            <div className="inline-block text-xs font-medium tracking-widest uppercase mb-3 px-3 py-1.5 rounded-full" style={{ color: '#C9A84C', background: 'rgba(201,168,76,0.1)' }}>
              {c('services_title')}
            </div>
          </motion.div>

          {loadingServices ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="p-6 rounded-2xl animate-pulse" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-10 h-10 rounded-xl mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="h-4 rounded mb-3 w-2/3" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="h-3 rounded mb-2" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  <div className="h-3 rounded w-1/2" style={{ background: 'rgba(255,255,255,0.04)' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${services.length >= 3 ? 'lg:grid-cols-4' : ''}`}>
              {services.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative group p-6 rounded-2xl active:scale-[0.98] transition-transform"
                  style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="relative z-10">
                    <div className="text-3xl mb-4">{SERVICE_ICONS[service.name] ?? '✂️'}</div>
                    <h3 className="font-display text-lg font-medium mb-2">{service.name}</h3>
                    {service.description && <p className="text-white/40 text-sm leading-relaxed mb-5">{service.description}</p>}
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="font-display text-xl font-semibold" style={{ color: '#C9A84C' }}>{formatCurrency(service.price)}</span>
                      <span className="flex items-center gap-1 text-xs text-white/30"><Clock className="w-3.5 h-3.5" />{service.duration} דק׳</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/book"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 active:scale-95"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C' }}
            >
              {c('services_cta')} <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-block text-xs font-medium tracking-widest uppercase mb-4 px-3 py-1.5 rounded-full" style={{ color: '#C9A84C', background: 'rgba(201,168,76,0.1)' }}>
                איפה אנחנו
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-light mb-4">{c('location_title')}</h2>
              <p className="text-white/50 mb-8 text-base leading-relaxed">{c('location_desc')}</p>
              <div className="space-y-5">
                {[
                  { icon: <MapPin className="w-5 h-5" style={{ color: '#C9A84C' }} />, label: 'כתובת', value: c('address') },
                  { icon: <Clock className="w-5 h-5" style={{ color: '#C9A84C' }} />, label: 'שעות פתיחה', value: c('hours') },
                  { icon: <Phone className="w-5 h-5" style={{ color: '#C9A84C' }} />, label: 'טלפון', value: c('phone') },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>{row.icon}</div>
                    <div>
                      <div className="font-medium text-white/90 text-sm">{row.label}</div>
                      <div className="text-white/50 text-sm mt-0.5 whitespace-pre-line">{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* WhatsApp CTA for mobile */}
              <a
                href={`https://wa.me/${c('phone').replace(/\D/g, '')}?text=שלום, אני מעוניין לקבוע תור`}
                target="_blank" rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-2 w-full sm:w-auto sm:inline-flex px-6 py-3.5 rounded-xl font-medium text-sm transition-all active:scale-95"
                style={{ background: '#25D366', color: 'white' }}
              >
                <span>💬</span> שלח הודעה בוואטסאפ
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-2xl overflow-hidden h-64 sm:h-80" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3395.5!2d34.8014!3d30.6057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15070f9b8e0f3b1f%3A0x1234!2sMitzpe%20Ramon%2C%20Israel!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%" height="100%" style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg)' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="p-8 sm:p-16 rounded-3xl relative overflow-hidden text-center"
            style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.03) 100%)', border: '1px solid rgba(201,168,76,0.15)' }}
          >
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <h2 className="font-display font-light mb-3" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>{c('cta_title')}</h2>
              <p className="text-white/50 mb-8 text-sm sm:text-base">{c('cta_subtitle')}</p>
              <Link href="/book"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 active:scale-95 w-full sm:w-auto justify-center"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97D)', color: '#0A0A0A', boxShadow: '0 0 40px rgba(201,168,76,0.3)' }}
              >
                {c('cta_button')} <ChevronLeft className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97D)' }}>
              <Scissors className="w-4 h-4 text-obsidian" />
            </div>
            <span className="font-display text-xl font-semibold">{c('footer_name')}</span>
          </div>
          <div className="flex items-center gap-5">
            {c('instagram_url') && (
              <a href={c('instagram_url')} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors text-sm"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {c('tiktok_url') && (
              <a href={c('tiktok_url')} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/>
                </svg>
              </a>
            )}
            {!c('instagram_url') && !c('tiktok_url') && (
              <span className="text-xs text-white/20">הוסף קישורים לרשתות חברתיות בפאנל הניהול</span>
            )}
          </div>
          <p className="text-white/30 text-sm">© 2024 {c('footer_name')}. כל הזכויות שמורות.</p>
        </div>
      </footer>

      {/* Mobile sticky book button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:hidden z-40" style={{ background: 'linear-gradient(0deg, rgba(10,10,10,0.98) 60%, transparent)' }}>
        <Link href="/book"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97D)', color: '#0A0A0A', boxShadow: '0 0 30px rgba(201,168,76,0.4)' }}
        >
          הזמן תור עכשיו <ChevronLeft className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}

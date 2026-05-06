'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, MapPin, Phone, ChevronLeft, Instagram } from 'lucide-react'
import { Service } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

const TEAL  = '#5BAFCA'
const GOLD  = '#C9A84C'
const GOLDE = '#E8C97D'

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
  phone: '052-553-3730',
  cta_title: 'מוכן להיראות במיטבך?',
  cta_subtitle: 'הזמן תור תוך פחות מדקה. ללא צורך בחשבון.',
  cta_button: 'הזמן עכשיו — בחינם',
  footer_name: 'Shoham Asafov Barber Shop',
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

      {/* ── Nav ── */}
      <nav className="fixed top-0 right-0 left-0 z-50 px-4 sm:px-6 py-3" style={{ background: 'linear-gradient(180deg, rgba(10,10,10,0.97) 0%, transparent 100%)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Shoham Asafov Barber Shop" width={44} height={44} className="rounded-full object-cover" style={{ border: `1.5px solid rgba(201,168,76,0.4)` }} />
            <div className="hidden sm:block">
              <div className="font-display text-base font-semibold leading-tight" style={{ color: GOLDE }}>Shoham Asafov</div>
              <div className="text-xs text-white/35 tracking-widest uppercase">Barber Shop</div>
            </div>
          </div>
          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm text-white/60 hover:text-white transition-colors">שירותים</a>
            <a href="#location" className="text-sm text-white/60 hover:text-white transition-colors">מיקום</a>
          </div>
          {/* CTA */}
          <Link href="/book"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 active:scale-95"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLDE})`, color: '#0A0A0A' }}
          >
            הזמן תור
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full" style={{ background: `radial-gradient(ellipse, rgba(201,168,76,0.1) 0%, transparent 70%)` }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full" style={{ background: `radial-gradient(ellipse, rgba(91,175,202,0.06) 0%, transparent 70%)` }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full" style={{ background: `radial-gradient(ellipse, rgba(91,175,202,0.04) 0%, transparent 70%)` }} />
        </div>

        <div className="relative z-10 text-center w-full max-w-2xl mx-auto pt-24">
          {/* Logo large */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-2xl scale-110" style={{ background: `radial-gradient(ellipse, rgba(201,168,76,0.25) 0%, rgba(91,175,202,0.12) 100%)` }} />
              <Image src="/logo.jpg" alt="Shoham Asafov Barber Shop" width={140} height={140} className="relative rounded-full object-cover" style={{ border: `2px solid rgba(201,168,76,0.35)`, boxShadow: `0 0 40px rgba(201,168,76,0.2), 0 0 80px rgba(91,175,202,0.1)` }} />
            </div>
          </motion.div>

          {/* Name */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-2">
            <div className="font-display text-3xl sm:text-4xl font-semibold" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLDE} 40%, ${TEAL} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Shoham Asafov
            </div>
            <div className="text-sm tracking-[0.3em] uppercase text-white/35 mt-1">Barber Shop</div>
          </motion.div>

          {/* Badge */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex justify-center mt-5 mb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: `rgba(91,175,202,0.08)`, border: `1px solid rgba(91,175,202,0.2)`, color: TEAL }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TEAL }} />
              {c('hero_badge')}
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.8 }}
            className="font-display font-light leading-snug mb-10 text-white/90"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 3rem)' }}
          >
            {c('hero_main')}
          </motion.h1>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/book"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLDE})`, color: '#0A0A0A', boxShadow: `0 0 30px rgba(201,168,76,0.3)` }}
            >
              {c('hero_cta_primary')} <ChevronLeft className="w-4 h-4" />
            </Link>
            <a href="#services"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-full font-medium text-base transition-all duration-300 active:scale-95"
              style={{ background: `rgba(91,175,202,0.06)`, border: `1px solid rgba(91,175,202,0.2)`, color: TEAL }}
            >
              {c('hero_cta_secondary')}
            </a>
          </motion.div>

          {/* Stat */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-16 flex justify-center gap-12">
            <div className="text-center">
              <div className="font-display text-3xl font-semibold" style={{ color: GOLD }}>{c('stat_clients')}</div>
              <div className="text-xs text-white/40 mt-1">{c('stat_clients_label')}</div>
            </div>
            <div className="w-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="text-center">
              <div className="font-display text-3xl font-semibold" style={{ color: TEAL }}>100%</div>
              <div className="text-xs text-white/40 mt-1">מקצועיות</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-16">
            <div className="inline-block text-xs font-medium tracking-widest uppercase mb-3 px-3 py-1.5 rounded-full" style={{ color: GOLD, background: 'rgba(201,168,76,0.08)', border: `1px solid rgba(201,168,76,0.15)` }}>
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
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${services.length >= 3 ? 'lg:grid-cols-4' : ''}`}>
              {services.map((service, i) => (
                <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="relative group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(145deg, #161616, #111)', border: `1px solid rgba(255,255,255,0.06)` }}
                >
                  {/* Teal accent line */}
                  <div className="absolute top-0 right-0 left-0 h-[2px] rounded-t-2xl" style={{ background: i % 2 === 0 ? `linear-gradient(90deg, ${GOLD}, transparent)` : `linear-gradient(90deg, ${TEAL}, transparent)` }} />
                  <div className="text-3xl mb-4">{SERVICE_ICONS[service.name] ?? '✂️'}</div>
                  <h3 className="font-display text-lg font-medium mb-2">{service.name}</h3>
                  {service.description && <p className="text-white/40 text-sm leading-relaxed mb-5">{service.description}</p>}
                  <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="font-display text-xl font-semibold" style={{ color: GOLD }}>{formatCurrency(service.price)}</span>
                    <span className="flex items-center gap-1 text-xs text-white/30"><Clock className="w-3.5 h-3.5" />{service.duration} דק׳</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/book"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLDE})`, color: '#0A0A0A', boxShadow: `0 0 20px rgba(201,168,76,0.2)` }}
            >
              {c('services_cta')} <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Location ── */}
      <section id="location" className="py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-block text-xs font-medium tracking-widest uppercase mb-4 px-3 py-1.5 rounded-full" style={{ color: TEAL, background: 'rgba(91,175,202,0.08)', border: `1px solid rgba(91,175,202,0.15)` }}>
                איפה אנחנו
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-light mb-4">{c('location_title')}</h2>
              <p className="text-white/50 mb-8 text-base leading-relaxed">{c('location_desc')}</p>
              <div className="space-y-5">
                {[
                  { icon: <MapPin className="w-5 h-5" style={{ color: GOLD }} />, label: 'כתובת', value: c('address'), color: GOLD },
                  { icon: <Clock className="w-5 h-5" style={{ color: TEAL }} />, label: 'שעות פתיחה', value: c('hours'), color: TEAL },
                  { icon: <Phone className="w-5 h-5" style={{ color: GOLD }} />, label: 'טלפון', value: c('phone'), color: GOLD },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${row.color}12`, border: `1px solid ${row.color}30` }}>{row.icon}</div>
                    <div>
                      <div className="font-medium text-white/90 text-sm">{row.label}</div>
                      <div className="text-white/50 text-sm mt-0.5 whitespace-pre-line">{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <a href={`https://wa.me/972525533730?text=שלום שוהם, אני מעוניין לקבוע תור`} target="_blank" rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-2 w-full sm:w-auto sm:inline-flex px-6 py-3.5 rounded-xl font-medium text-sm transition-all active:scale-95"
                style={{ background: '#25D366', color: 'white' }}
              >
                <span>💬</span> שלח הודעה בוואטסאפ
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-2xl overflow-hidden h-64 sm:h-80" style={{ border: `1px solid rgba(91,175,202,0.15)`, boxShadow: `0 0 30px rgba(91,175,202,0.05)` }}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3395.5!2d34.8014!3d30.6057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15070f9b8e0f3b1f%3A0x1234!2sMitzpe%20Ramon%2C%20Israel!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%" height="100%" style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg)' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="p-8 sm:p-16 rounded-3xl relative overflow-hidden text-center"
            style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(91,175,202,0.04) 100%)', border: `1px solid rgba(201,168,76,0.12)` }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}40, ${TEAL}30, transparent)` }} />
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full" style={{ background: `radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)` }} />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full" style={{ background: `radial-gradient(ellipse, rgba(91,175,202,0.06) 0%, transparent 70%)` }} />
            </div>
            <div className="relative z-10">
              <h2 className="font-display font-light mb-3" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>{c('cta_title')}</h2>
              <p className="text-white/50 mb-8 text-sm sm:text-base">{c('cta_subtitle')}</p>
              <Link href="/book"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 active:scale-95 w-full sm:w-auto justify-center"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLDE})`, color: '#0A0A0A', boxShadow: `0 0 40px rgba(201,168,76,0.3)` }}
              >
                {c('cta_button')} <ChevronLeft className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-12 px-4 sm:px-6" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 text-center">
          <Image src="/logo.jpg" alt="Shoham Asafov Barber Shop" width={60} height={60} className="rounded-full object-cover" style={{ border: `1px solid rgba(201,168,76,0.3)` }} />
          <div>
            <div className="font-display text-xl font-semibold" style={{ color: GOLDE }}>Shoham Asafov</div>
            <div className="text-xs tracking-widest uppercase text-white/30 mt-0.5">Barber Shop · שוהם אסאפוב ברבר שופ</div>
          </div>
          <div className="flex items-center gap-5">
            {c('instagram_url') && (
              <a href={c('instagram_url')} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/80 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-white/20">
            <a href="/terms" className="hover:text-white/40 transition-colors">תנאי שימוש</a>
            <span>·</span>
            <a href="/accessibility" className="hover:text-white/40 transition-colors">נגישות</a>
            <span>·</span>
            <span>© {new Date().getFullYear()} Shoham Asafov Barber Shop</span>
          </div>
        </div>
      </footer>

      {/* Mobile sticky book button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:hidden z-40" style={{ background: 'linear-gradient(0deg, rgba(10,10,10,0.98) 60%, transparent)' }}>
        <Link href="/book"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
          style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLDE})`, color: '#0A0A0A', boxShadow: `0 0 30px rgba(201,168,76,0.4)` }}
        >
          הזמן תור עכשיו <ChevronLeft className="w-5 h-5" />
        </Link>
      </div>

    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, User, Phone, Mail } from 'lucide-react'

interface Props {
  data: { name: string; phone: string; email: string }
  onChange: (data: { name: string; phone: string; email: string }) => void
  onNext: () => void
  onBack: () => void
}

function Field({ label, icon, value, onChange, type = 'text', placeholder, required, error }: {
  label: string; icon: React.ReactNode; value: string; onChange: (v: string) => void
  type?: string; placeholder: string; required?: boolean; error?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label className="block text-xs font-medium text-white/40 mb-2">{label} {required && <span style={{ color: '#C9A84C' }}>*</span>}</label>
      <div className="relative flex items-center rounded-xl transition-all" style={{ background: '#1C1C1C', border: `2px solid ${error ? 'rgba(239,68,68,0.5)' : focused ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.07)'}` }}>
        <div className="pr-4 text-white/30 flex-shrink-0">{icon}</div>
        <input
          type={type} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 px-3 py-4 bg-transparent text-sm text-white placeholder-white/20 outline-none text-right"
          style={{ fontSize: '16px' }}
        />
      </div>
      {error && <p className="text-xs mt-1.5" style={{ color: 'rgba(239,68,68,0.8)' }}>{error}</p>}
    </div>
  )
}

export default function DetailsStep({ data, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!data.name.trim() || data.name.trim().length < 2) e.name = 'אנא הזן שם מלא.'
    if (!data.phone.trim() || !/^[\d\s\+\-\(\)]{7,15}$/.test(data.phone.trim())) e.phone = 'אנא הזן מספר טלפון תקין.'
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'אימייל לא תקין.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-3xl sm:text-4xl font-light mb-1.5">הפרטים <span style={{ color: '#C9A84C' }}>שלך</span></h2>
        <p className="text-white/40 text-sm">נשתמש בפרטים לאישור התור.</p>
      </div>
      <div className="space-y-4 mb-6">
        <Field label="שם מלא" icon={<User className="w-4 h-4" />} value={data.name} onChange={v => onChange({ ...data, name: v })} placeholder="השם המלא שלך" required error={errors.name} />
        <Field label="מספר טלפון" icon={<Phone className="w-4 h-4" />} value={data.phone} onChange={v => onChange({ ...data, phone: v })} type="tel" placeholder="050-000-0000" required error={errors.phone} />
        <Field label="אימייל (אופציונלי)" icon={<Mail className="w-4 h-4" />} value={data.email} onChange={v => onChange({ ...data, email: v })} type="email" placeholder="your@email.com" error={errors.email} />
        <div className="p-4 rounded-xl text-xs text-white/40 leading-relaxed" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          🔒 הפרטים שלך פרטיים ומשמשים רק לניהול התור.
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => { if (validate()) onNext() }} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97D)', color: '#0A0A0A' }}>
          <ChevronLeft className="w-4 h-4" /> המשך
        </button>
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-4 rounded-xl text-sm font-medium text-white/50 hover:text-white transition-colors active:scale-[0.98]" style={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.06)' }}>
          חזור <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

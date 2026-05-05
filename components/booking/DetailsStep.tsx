'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, User, Phone, Mail, ShieldCheck } from 'lucide-react'

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
  const [consent, setConsent] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!data.name.trim() || data.name.trim().length < 2) e.name = 'אנא הזן שם מלא.'
    if (!data.phone.trim() || !/^[\d\s\+\-\(\)]{7,15}$/.test(data.phone.trim())) e.phone = 'אנא הזן מספר טלפון תקין.'
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'אימייל לא תקין.'
    if (!consent) e.consent = 'יש לאשר את תנאי השימוש ומדיניות הפרטיות להמשך.'
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

        {/* Consent checkbox */}
        <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${errors.consent ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.06)'}` }}>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={consent}
                onChange={e => {
                  setConsent(e.target.checked)
                  if (e.target.checked) setErrors(prev => ({ ...prev, consent: '' }))
                }}
                className="sr-only"
              />
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center transition-all"
                style={{
                  background: consent ? 'linear-gradient(135deg, #C9A84C, #E8C97D)' : 'transparent',
                  border: consent ? 'none' : '2px solid rgba(255,255,255,0.2)',
                }}
              >
                {consent && <svg className="w-3 h-3" fill="none" stroke="#0A0A0A" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
            </div>
            <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              קראתי ואני מסכים/ה ל
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="mx-1 underline underline-offset-2 transition-colors" style={{ color: '#C9A84C' }}>
                תנאי השימוש ומדיניות הפרטיות
              </a>
              של ספרייה שוהם. אני מאשר/ת שהפרטים שמסרתי נכונים ושניתן ליצור איתי קשר לצורך ניהול התור.
            </span>
          </label>
          {errors.consent && (
            <p className="text-xs mt-2 flex items-center gap-1.5" style={{ color: 'rgba(239,68,68,0.8)' }}>
              <ShieldCheck className="w-3.5 h-3.5" /> {errors.consent}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => { if (validate()) onNext() }}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97D)', color: '#0A0A0A' }}
        >
          <ChevronLeft className="w-4 h-4" /> המשך
        </button>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-4 rounded-xl text-sm font-medium text-white/50 hover:text-white transition-colors active:scale-[0.98]"
          style={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          חזור <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

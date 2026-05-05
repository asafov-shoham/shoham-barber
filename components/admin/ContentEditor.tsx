'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Check, AlertCircle, Loader2, Instagram, ExternalLink } from 'lucide-react'

interface ContentRow { key: string; value: string; label: string }

const FIELD_META: Record<string, { label: string; multiline?: boolean; placeholder?: string }> = {
  hero_badge:          { label: 'תגית קטנה מעל הכותרת (הפס הזהב)',        placeholder: 'ספר גברים מצפה רמון' },
  hero_main:           { label: 'כותרת ראשית גדולה',                        multiline: true, placeholder: 'כל תספורת היא יצירה...' },
  hero_cta_primary:    { label: 'כפתור ראשי',                               placeholder: 'הזמן תור עכשיו' },
  hero_cta_secondary:  { label: 'כפתור משני',                               placeholder: 'לצפייה בשירותים' },
  stat_clients:        { label: 'מספר לקוחות',                              placeholder: '+50' },
  stat_clients_label:  { label: 'תווית מתחת למספר הלקוחות',               placeholder: 'לקוחות מרוצים' },
  services_title:      { label: 'כותרת קטגוריית שירותים',                 placeholder: 'השירותים שלנו' },
  services_cta:        { label: 'כפתור "הזמן כל שירות"',                   placeholder: 'הזמן כל שירות' },
  location_title:      { label: 'כותרת חלק המיקום',                        placeholder: 'בוא לבקר' },
  location_desc:       { label: 'תיאור חלק המיקום',                        multiline: true, placeholder: 'אנחנו ממוקמים בלב מצפה רמון...' },
  address:             { label: 'כתובת הספרייה',                           placeholder: 'רחוב הראשי 1, מצפה רמון' },
  hours:               { label: 'שעות פתיחה',                              multiline: true, placeholder: 'ראשון–חמישי: 09:00–19:00\nשישי: 09:00–15:00\nשבת: סגור' },
  phone:               { label: 'מספר טלפון',                              placeholder: '050-123-4567' },
  cta_title:           { label: 'כותרת הבאנר התחתון',                     placeholder: 'מוכן להיראות במיטבך?' },
  cta_subtitle:        { label: 'תת-כותרת הבאנר התחתון',                  placeholder: 'הזמן תור תוך פחות מדקה' },
  cta_button:          { label: 'כפתור הבאנר התחתון',                     placeholder: 'הזמן עכשיו — בחינם' },
  footer_name:         { label: 'שם העסק (נאב + פוטר)',                   placeholder: 'שוהם ברבר שופ' },
  instagram_url:       { label: 'קישור לאינסטגרם',                        placeholder: 'https://instagram.com/shoham_barber' },
  tiktok_url:          { label: 'קישור לטיקטוק',                          placeholder: 'https://tiktok.com/@shoham_barber' },
}

const SECTIONS = [
  { title: '🏠 אזור ה-Hero (ראש הדף)', keys: ['hero_badge', 'hero_main', 'hero_cta_primary', 'hero_cta_secondary', 'stat_clients', 'stat_clients_label'] },
  { title: '✂️ אזור השירותים',          keys: ['services_title', 'services_cta'] },
  { title: '📍 מיקום ויצירת קשר',        keys: ['location_title', 'location_desc', 'address', 'hours', 'phone'] },
  { title: '🟡 באנר תחתון',             keys: ['cta_title', 'cta_subtitle', 'cta_button'] },
  { title: '⚙️ כללי',                   keys: ['footer_name'] },
  { title: '📱 רשתות חברתיות',          keys: ['instagram_url', 'tiktok_url'] },
]

export default function ContentEditor() {
  const [content, setContent] = useState<Record<string, string>>({})
  const [original, setOriginal] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(data => { setContent(data); setOriginal(data) })
      .catch(() => setError('לא ניתן לטעון את התכנים'))
      .finally(() => setLoading(false))
  }, [])

  const changed = Object.keys(content).filter(k => content[k] !== original[k])
  const hasChanges = changed.length > 0

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const updates: Record<string, string> = {}
      changed.forEach(k => { updates[k] = content[k] })
      const res = await fetch('/api/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error()
      setOriginal({ ...content })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('שגיאה בשמירה. נסה שוב.')
    } finally {
      setSaving(false)
    }
  }

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
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-2xl font-medium">עריכת תכנים</h2>
          <p className="text-xs text-white/30 mt-1">כל שינוי שתשמור יופיע מיד באתר.</p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              onClick={() => setContent({ ...original })}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white transition-colors"
              style={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              בטל שינויים
            </motion.button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: saved ? 'rgba(52,211,153,0.15)' : 'linear-gradient(135deg, #C9A84C, #E8C97D)',
              color: saved ? 'rgb(52,211,153)' : '#0A0A0A',
              border: saved ? '1px solid rgba(52,211,153,0.3)' : 'none',
            }}
          >
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />שומר...</>
             : saved  ? <><Check className="w-4 h-4" />נשמר!</>
             : <><Save className="w-4 h-4" />שמור {hasChanges ? `(${changed.length})` : ''}</>}
          </button>
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-3 p-4 rounded-xl mb-6"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-400">{error}</span>
        </motion.div>
      )}

      {hasChanges && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-2 p-3 rounded-xl mb-6 text-xs"
          style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', color: '#C9A84C' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {changed.length} שינויים שלא נשמרו עדיין
        </motion.div>
      )}

      <div className="space-y-5">
        {SECTIONS.map((section, si) => (
          <motion.div key={section.title}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.06 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
              <h3 className="text-sm font-medium text-white/60">{section.title}</h3>
            </div>

            <div className="p-5 space-y-5">
              {section.keys.map(key => {
                const meta = FIELD_META[key]
                const isChanged = content[key] !== original[key]
                const isSocial = key === 'instagram_url' || key === 'tiktok_url'

                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-white/40">{meta?.label ?? key}</label>
                      <div className="flex items-center gap-2">
                        {/* Preview link for social */}
                        {isSocial && content[key] && (
                          <a href={content[key]} target="_blank" rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity"
                            style={{ color: '#C9A84C' }}
                          >
                            <ExternalLink className="w-3 h-3" />
                            תצוגה מקדימה
                          </a>
                        )}
                        {isChanged && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>שונה</span>
                        )}
                      </div>
                    </div>

                    {meta?.multiline ? (
                      <textarea
                        value={content[key] ?? ''}
                        onChange={e => setContent(c => ({ ...c, [key]: e.target.value }))}
                        rows={key === 'hours' ? 4 : 3}
                        placeholder={meta.placeholder}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none transition-all leading-relaxed placeholder-white/15"
                        style={{ background: '#0D0D0D', border: `1.5px solid ${isChanged ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.07)'}`, direction: 'rtl', fontSize: '16px' }}
                        onFocus={e => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                        onBlur={e => (e.target.style.borderColor = isChanged ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.07)')}
                      />
                    ) : (
                      <input
                        type={isSocial ? 'url' : 'text'}
                        value={content[key] ?? ''}
                        onChange={e => setContent(c => ({ ...c, [key]: e.target.value }))}
                        placeholder={meta?.placeholder}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all placeholder-white/15"
                        style={{ background: '#0D0D0D', border: `1.5px solid ${isChanged ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.07)'}`, direction: isSocial ? 'ltr' : 'rtl', fontSize: '16px' }}
                        onFocus={e => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                        onBlur={e => (e.target.style.borderColor = isChanged ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.07)')}
                      />
                    )}

                    {/* Social hint */}
                    {isSocial && !content[key] && (
                      <p className="text-xs mt-1.5 text-white/25">
                        {key === 'instagram_url' ? 'לדוגמה: https://instagram.com/username' : 'לדוגמה: https://tiktok.com/@username'}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {hasChanges && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex justify-end">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97D)', color: '#0A0A0A', boxShadow: '0 0 25px rgba(201,168,76,0.25)' }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            שמור {changed.length} שינויים
          </button>
        </motion.div>
      )}
    </div>
  )
}

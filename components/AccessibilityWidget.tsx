'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface A11ySettings {
  fontSize: number        // 100 = normal, 120 = large, 140 = very large
  highContrast: boolean
  grayscale: boolean
  underlineLinks: boolean
  bigCursor: boolean
  readingGuide: boolean
  pauseAnimations: boolean
}

const DEFAULT: A11ySettings = {
  fontSize: 100,
  highContrast: false,
  grayscale: false,
  underlineLinks: false,
  bigCursor: false,
  readingGuide: false,
  pauseAnimations: false,
}

const STORAGE_KEY = 'a11y_settings'

function WheelchairIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM9 6.75A.75.75 0 0 1 9.75 6h4.5a.75.75 0 0 1 .75.75V11h1.25a.75.75 0 0 1 0 1.5H15v.25a5 5 0 1 1-2-.4V12h-1.75a.75.75 0 0 1 0-1.5H13V7.5h-3.25A.75.75 0 0 1 9 6.75zM10 17a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"/>
    </svg>
  )
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT)
  const [mouseY, setMouseY] = useState(0)

  // Load saved settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setSettings(JSON.parse(saved))
    } catch {}
  }, [])

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement

    // Font size
    root.style.setProperty('--a11y-font-scale', `${settings.fontSize / 100}`)
    root.style.fontSize = `${settings.fontSize}%`

    // High contrast
    if (settings.highContrast) {
      root.style.setProperty('--background', '0 0% 0%')
      root.style.setProperty('--foreground', '0 0% 100%')
      root.style.setProperty('--card', '0 0% 5%')
      document.body.style.filter = settings.grayscale ? 'grayscale(100%) contrast(2)' : 'contrast(2)'
    } else if (settings.grayscale) {
      document.body.style.filter = 'grayscale(100%)'
      root.style.removeProperty('--background')
      root.style.removeProperty('--foreground')
      root.style.removeProperty('--card')
    } else {
      document.body.style.filter = ''
      root.style.removeProperty('--background')
      root.style.removeProperty('--foreground')
      root.style.removeProperty('--card')
    }

    // Underline links
    if (settings.underlineLinks) {
      const style = document.getElementById('a11y-links') || document.createElement('style')
      style.id = 'a11y-links'
      style.textContent = 'a { text-decoration: underline !important; }'
      document.head.appendChild(style)
    } else {
      document.getElementById('a11y-links')?.remove()
    }

    // Big cursor
    document.body.style.cursor = settings.bigCursor ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'white\' stroke=\'black\' stroke-width=\'1\' d=\'M5 3l14 9-7 1-4 7z\'/%3E%3C/svg%3E") 0 0, auto' : ''

    // Pause animations
    if (settings.pauseAnimations) {
      const style = document.getElementById('a11y-anim') || document.createElement('style')
      style.id = 'a11y-anim'
      style.textContent = '*, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }'
      document.head.appendChild(style)
    } else {
      document.getElementById('a11y-anim')?.remove()
    }

    // Save to localStorage
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)) } catch {}
  }, [settings])

  // Reading guide
  useEffect(() => {
    if (!settings.readingGuide) return
    const handler = (e: MouseEvent) => setMouseY(e.clientY)
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [settings.readingGuide])

  const update = (key: keyof A11ySettings, value: A11ySettings[keyof A11ySettings]) => {
    setSettings(s => ({ ...s, [key]: value }))
  }

  const reset = () => {
    setSettings(DEFAULT)
    document.documentElement.style.fontSize = ''
    document.body.style.filter = ''
    document.body.style.cursor = ''
    document.getElementById('a11y-links')?.remove()
    document.getElementById('a11y-anim')?.remove()
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  const Toggle = ({ label, icon, value, onChange }: { label: string; icon: string; value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between p-3.5 rounded-xl transition-all active:scale-[0.98]"
      style={{
        background: value ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)',
        border: value ? '1.5px solid rgba(201,168,76,0.4)' : '1.5px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium" style={{ color: value ? '#C9A84C' : 'rgba(255,255,255,0.7)' }}>{label}</span>
      </div>
      <div
        className="w-10 h-5 rounded-full flex items-center transition-all duration-200 px-0.5"
        style={{ background: value ? '#C9A84C' : 'rgba(255,255,255,0.15)', justifyContent: value ? 'flex-end' : 'flex-start' }}
      >
        <div className="w-4 h-4 rounded-full bg-white shadow" />
      </div>
    </button>
  )

  return (
    <>
      {/* Reading guide line */}
      {settings.readingGuide && (
        <div
          className="fixed left-0 right-0 pointer-events-none z-[9998]"
          style={{ top: mouseY - 1, height: '2px', background: 'rgba(201,168,76,0.6)' }}
        />
      )}

      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 left-4 md:bottom-8 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: open ? '#C9A84C' : 'rgba(20,20,20,0.95)',
          border: '2px solid rgba(201,168,76,0.5)',
          color: open ? '#0A0A0A' : '#C9A84C',
        }}
        aria-label="פתח תפריט נגישות"
        title="נגישות"
      >
        <WheelchairIcon />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop on mobile */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-4 left-4 z-50 w-72 rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}>
                    <WheelchairIcon />
                  </div>
                  <span className="font-display font-semibold text-sm">נגישות</span>
                </div>
                <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
                {/* Font Size */}
                <div className="p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔤</span>
                      <span className="text-sm font-medium text-white/70">גודל טקסט</span>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>
                      {settings.fontSize}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => update('fontSize', Math.max(80, settings.fontSize - 10))}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold transition-all hover:bg-white/10 active:scale-95"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }}
                    >
                      A
                    </button>
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${((settings.fontSize - 80) / 80) * 100}%`, background: 'linear-gradient(90deg, #C9A84C, #E8C97D)' }}
                      />
                    </div>
                    <button
                      onClick={() => update('fontSize', Math.min(160, settings.fontSize + 10))}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-xl font-bold transition-all hover:bg-white/10 active:scale-95"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }}
                    >
                      A
                    </button>
                  </div>
                </div>

                {/* Toggles */}
                <Toggle label="ניגודיות גבוהה"    icon="🌗" value={settings.highContrast}     onChange={v => update('highContrast', v)} />
                <Toggle label="גווני אפור"          icon="⬛" value={settings.grayscale}         onChange={v => update('grayscale', v)} />
                <Toggle label="הדגשת קישורים"       icon="🔗" value={settings.underlineLinks}   onChange={v => update('underlineLinks', v)} />
                <Toggle label="עצור אנימציות"       icon="⏸️" value={settings.pauseAnimations}  onChange={v => update('pauseAnimations', v)} />
                <Toggle label="מדריך קריאה"          icon="📏" value={settings.readingGuide}     onChange={v => update('readingGuide', v)} />
                <Toggle label="סמן גדול"             icon="🖱️" value={settings.bigCursor}        onChange={v => update('bigCursor', v)} />

                {/* Reset */}
                <button
                  onClick={reset}
                  className="w-full py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] mt-1"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                >
                  ↺ איפוס הכל
                </button>
              </div>

              <div className="px-5 py-3 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-xs text-white/20">ההגדרות נשמרות אוטומטית</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

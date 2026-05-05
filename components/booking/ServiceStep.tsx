'use client'

import { motion } from 'framer-motion'
import { Clock, CheckCircle2 } from 'lucide-react'
import { Service } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

const ICONS: Record<string, string> = {
  'תספורת קלאסית': '✂️', 'פייד חתימה': '💈', 'עיצוב זקן': '🪒', 'חבילת הפינוק המלאה': '👑',
}

export default function ServiceStep({ services, selected, onSelect }: { services: Service[]; selected?: string; onSelect: (id: string) => void }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-3xl sm:text-4xl font-light mb-1.5">בחר <span style={{ color: '#C9A84C' }}>שירות</span></h2>
        <p className="text-white/40 text-sm">לחץ על השירות שברצונך להזמין.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((service, i) => {
          const isSelected = selected === service.id
          return (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => onSelect(service.id)}
              className="relative text-right p-5 rounded-2xl transition-all duration-200 active:scale-[0.97] w-full"
              style={{ background: isSelected ? 'rgba(201,168,76,0.08)' : '#141414', border: isSelected ? '2px solid rgba(201,168,76,0.5)' : '2px solid rgba(255,255,255,0.06)' }}
            >
              {isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 left-4">
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#C9A84C' }} />
                </motion.div>
              )}
              <div className="text-3xl mb-3">{ICONS[service.name] ?? '✂️'}</div>
              <h3 className="font-display text-lg font-medium mb-1">{service.name}</h3>
              {service.description && <p className="text-white/40 text-xs leading-relaxed mb-4">{service.description}</p>}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-white/30"><Clock className="w-3.5 h-3.5" />{service.duration} דק׳</div>
                <span className="font-display text-xl font-semibold" style={{ color: '#C9A84C' }}>{formatCurrency(service.price)}</span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

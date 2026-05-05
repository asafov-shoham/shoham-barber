'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit3, Trash2, Check, X, Clock, Scissors } from 'lucide-react'
import { Service } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface Props { services: Service[]; onUpdate: (services: Service[]) => void }
interface ServiceForm { name: string; price: string; duration: string; description: string }
const EMPTY: ServiceForm = { name: '', price: '', duration: '', description: '' }

export default function ServicesPanel({ services, onUpdate }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ServiceForm>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<ServiceForm>>({})

  const validate = () => {
    const e: Partial<ServiceForm> = {}
    if (!form.name.trim()) e.name = 'שדה חובה'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'מחיר תקין נדרש'
    if (!form.duration || isNaN(Number(form.duration)) || Number(form.duration) <= 0) e.duration = 'משך זמן תקין נדרש'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const openCreate = () => { setEditingId(null); setForm(EMPTY); setErrors({}); setShowForm(true) }
  const openEdit = (s: Service) => { setEditingId(s.id); setForm({ name: s.name, price: String(s.price), duration: String(s.duration), description: s.description || '' }); setErrors({}); setShowForm(true) }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const payload = { name: form.name.trim(), price: Number(form.price), duration: Number(form.duration), description: form.description.trim() || null }
      if (editingId) {
        const res = await fetch(`/api/services/${editingId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (res.ok) { const updated = await res.json(); onUpdate(services.map((s) => s.id === editingId ? { ...s, ...updated } : s)) }
      } else {
        const res = await fetch('/api/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (res.ok) { const created = await res.json(); onUpdate([...services, created]) }
      }
      setShowForm(false); setForm(EMPTY); setEditingId(null)
    } finally { setLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('למחוק שירות זה?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' })
      if (res.ok) onUpdate(services.filter((s) => s.id !== id))
    } finally { setLoading(false) }
  }

  const InputField = ({ label, field, type = 'text', placeholder }: { label: string; field: keyof ServiceForm; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-medium text-white/40 mb-1.5">{label}</label>
      <input
        type={type} value={form[field]}
        onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white outline-none transition-all text-right"
        style={{ background: '#0D0D0D', border: errors[field] ? '1.5px solid rgba(239,68,68,0.5)' : '1.5px solid rgba(255,255,255,0.08)' }}
        onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.4)')}
        onBlur={(e) => (e.target.style.borderColor = errors[field] ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)')}
      />
      {errors[field] && <p className="text-xs mt-1" style={{ color: 'rgba(239,68,68,0.8)' }}>{errors[field]}</p>}
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-medium">שירותים</h2>
          <p className="text-xs text-white/30 mt-0.5">{services.length} שירותים פעילים</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97D)', color: '#0A0A0A' }}>
          <Plus className="w-4 h-4" />
          הוסף שירות
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service, i) => (
          <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="group relative p-6 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.1)' }}>
                  <Scissors className="w-5 h-5" style={{ color: '#C9A84C' }} />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(service)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"><Edit3 className="w-3.5 h-3.5 text-white/50" /></button>
                  <button onClick={() => handleDelete(service.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400/60" /></button>
                </div>
              </div>
              <h3 className="font-display text-lg font-medium mb-1.5">{service.name}</h3>
              {service.description && <p className="text-xs text-white/40 leading-relaxed mb-4 line-clamp-2">{service.description}</p>}
              <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="font-display text-xl font-semibold" style={{ color: '#C9A84C' }}>{formatCurrency(service.price)}</span>
                <span className="flex items-center gap-1.5 text-xs text-white/30"><Clock className="w-3.5 h-3.5" />{service.duration} דק׳</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={() => setShowForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.25 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl overflow-hidden" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="font-display text-lg font-medium">{editingId ? 'עריכת שירות' : 'שירות חדש'}</h3>
                <button onClick={() => setShowForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 space-y-4">
                <InputField label="שם השירות" field="name" placeholder="תספורת קלאסית" />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="מחיר (₪)" field="price" type="number" placeholder="80" />
                  <InputField label="משך (דקות)" field="duration" type="number" placeholder="30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">תיאור (אופציונלי)</label>
                  <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="תיאור קצר של השירות..." rows={3} className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white outline-none resize-none text-right" style={{ background: '#0D0D0D', border: '1.5px solid rgba(255,255,255,0.08)' }} onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.4)')} onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
                </div>
              </div>
              <div className="px-6 py-4 flex items-center justify-end gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white transition-colors" style={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.06)' }}>ביטול</button>
                <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97D)', color: '#0A0A0A' }}>
                  {loading ? '...' : <Check className="w-4 h-4" />}
                  {editingId ? 'שמור שינויים' : 'צור שירות'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

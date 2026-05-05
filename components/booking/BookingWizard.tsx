'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Scissors, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { Service, BookingFormData } from '@/lib/types'
import ServiceStep from './ServiceStep'
import DateStep from './DateStep'
import TimeStep from './TimeStep'
import DetailsStep from './DetailsStep'
import ReviewStep from './ReviewStep'

const STEPS = [
  { id: 1, label: 'שירות' },
  { id: 2, label: 'תאריך' },
  { id: 3, label: 'שעה' },
  { id: 4, label: 'פרטים' },
  { id: 5, label: 'אישור' },
]

export default function BookingWizard({ services }: { services: Service[] }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<BookingFormData>>({})

  const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, 5)) }
  const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 1)) }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'שגיאה')
      }
      const booking = await res.json()
      router.push(`/confirmation?id=${booking.id}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'משהו השתבש. נסה שוב.')
      setIsSubmitting(false)
    }
  }

  const selectedService = services.find(s => s.id === formData.serviceId)

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? -50 : 50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? -50 : 50, opacity: 0 }),
  }

  return (
    <div className="min-h-screen bg-obsidian text-white flex flex-col" dir="rtl">
      {/* Header */}
      <div className="flex-shrink-0 border-b px-4 sm:px-6 py-4 flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(14,14,14,0.95)', backdropFilter: 'blur(12px)' }}>
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97D)' }}>
              <Scissors className="w-3.5 h-3.5 text-obsidian" />
            </div>
            <span className="font-display text-base font-semibold text-white">שוהם</span>
          </div>
          <ArrowRight className="w-4 h-4 mr-1" />
        </Link>
        <div className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>
          {step} / 5
        </div>
      </div>

      {/* Progress */}
      <div className="flex-shrink-0 px-4 sm:px-6 pt-5 pb-2">
        <div className="flex justify-between mb-2.5">
          {STEPS.map(s => (
            <div key={s.id} className="text-xs font-medium transition-colors" style={{ color: s.id === step ? '#C9A84C' : s.id < step ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)' }}>
              {s.label}
            </div>
          ))}
        </div>
        <div className="relative h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div className="absolute inset-y-0 right-0 rounded-full" style={{ background: 'linear-gradient(270deg, #C9A84C, #E8C97D)' }} animate={{ width: `${((step - 1) / 4) * 100}%` }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
          {STEPS.map(s => (
            <div key={s.id} className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ right: `${((s.id - 1) / 4) * 100}%`, background: s.id <= step ? '#C9A84C' : '#1C1C1C', border: `2px solid ${s.id <= step ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`, zIndex: 10 }}
            >
              {s.id < step && <Check className="w-2.5 h-2.5 text-obsidian" />}
              {s.id === step && <div className="w-1.5 h-1.5 rounded-full bg-obsidian" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-xl mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              {step === 1 && <ServiceStep services={services} selected={formData.serviceId} onSelect={id => { setFormData(d => ({ ...d, serviceId: id })); goNext() }} />}
              {step === 2 && <DateStep selected={formData.date} onSelect={date => { setFormData(d => ({ ...d, date })); goNext() }} onBack={goBack} />}
              {step === 3 && <TimeStep selected={formData.time} date={formData.date || ''} onSelect={time => { setFormData(d => ({ ...d, time })); goNext() }} onBack={goBack} />}
              {step === 4 && <DetailsStep data={{ name: formData.name || '', phone: formData.phone || '', email: formData.email || '' }} onChange={data => setFormData(d => ({ ...d, ...data }))} onNext={goNext} onBack={goBack} />}
              {step === 5 && <ReviewStep formData={formData as BookingFormData} service={selectedService} onSubmit={handleSubmit} onBack={goBack} isSubmitting={isSubmitting} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

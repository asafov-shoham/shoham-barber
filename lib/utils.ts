import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { he } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'EEEE, d בMMMM yyyy', { locale: he })
  } catch {
    return dateStr
  }
}

export function formatTime(timeStr: string): string {
  try {
    const [hours, minutes] = timeStr.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, minutes)
    return format(date, 'HH:mm')
  } catch {
    return timeStr
  }
}

export function formatCurrency(amount: number): string {
  return `₪${amount}`
}

export function generateTimeSlots(startHour = 9, endHour = 19, intervalMinutes = 30): string[] {
  const slots: string[] = []
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += intervalMinutes) {
      const hh = String(hour).padStart(2, '0')
      const mm = String(min).padStart(2, '0')
      slots.push(`${hh}:${mm}`)
    }
  }
  return slots
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    case 'CONFIRMED':
      return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
    case 'COMPLETED':
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    case 'CANCELLED':
      return 'text-red-400 bg-red-400/10 border-red-400/20'
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'PENDING': return 'ממתין'
    case 'CONFIRMED': return 'מאושר'
    case 'COMPLETED': return 'הושלם'
    case 'CANCELLED': return 'בוטל'
    default: return status
  }
}

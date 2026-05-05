export interface Service {
  id: string
  name: string
  price: number
  duration: number
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  name: string
  phone: string
  email?: string | null
  serviceId: string
  service: Service
  date: string
  time: string
  status: BookingStatus
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export interface BookingFormData {
  serviceId: string
  date: string
  time: string
  name: string
  phone: string
  email?: string
  notes?: string
}

export interface CreateBookingPayload {
  name: string
  phone: string
  email?: string
  serviceId: string
  date: string
  time: string
  notes?: string
}

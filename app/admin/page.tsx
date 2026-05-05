import { prisma } from '@/lib/prisma'
import AdminDashboard from '@/components/admin/AdminDashboard'
import { Booking, Service, BookingStatus } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface PrismaBooking {
  id: string; name: string; phone: string; email: string | null
  serviceId: string; date: string; time: string; status: string
  notes: string | null; createdAt: Date; updatedAt: Date
  service: {
    id: string; name: string; price: number; duration: number
    description: string | null; isActive: boolean; createdAt: Date; updatedAt: Date
  }
}

interface PrismaService {
  id: string; name: string; price: number; duration: number
  description: string | null; isActive: boolean; createdAt: Date; updatedAt: Date
}

export default async function AdminPage() {
  const [rawBookings, rawServices] = await Promise.all([
    prisma.booking.findMany({ include: { service: true }, orderBy: { createdAt: 'desc' } }),
    prisma.service.findMany({ where: { isActive: true }, orderBy: { createdAt: 'asc' } }),
  ])

  const bookings: Booking[] = (rawBookings as PrismaBooking[]).map(b => ({
    id: b.id, name: b.name, phone: b.phone, email: b.email,
    serviceId: b.serviceId, date: b.date, time: b.time,
    status: b.status as BookingStatus, notes: b.notes,
    createdAt: b.createdAt.toISOString(), updatedAt: b.updatedAt.toISOString(),
    service: {
      id: b.service.id, name: b.service.name, price: b.service.price,
      duration: b.service.duration, description: b.service.description ?? null,
      isActive: b.service.isActive,
      createdAt: b.service.createdAt.toISOString(),
      updatedAt: b.service.updatedAt.toISOString(),
    },
  }))

  const services: Service[] = (rawServices as PrismaService[]).map(s => ({
    id: s.id, name: s.name, price: s.price, duration: s.duration,
    description: s.description ?? null, isActive: s.isActive,
    createdAt: s.createdAt.toISOString(), updatedAt: s.updatedAt.toISOString(),
  }))

  const today = new Date().toISOString().split('T')[0]
  const todayBookings = bookings.filter(b => b.date === today)

  return (
    <AdminDashboard
      initialBookings={bookings}
      initialServices={services}
      stats={{
        todayCount: todayBookings.length,
        todayRevenue: todayBookings
          .filter(b => b.status === 'COMPLETED')
          .reduce((sum, b) => sum + b.service.price, 0),
        totalBookings: bookings.length,
        pendingCount: bookings.filter(b => b.status === 'PENDING').length,
      }}
    />
  )
}

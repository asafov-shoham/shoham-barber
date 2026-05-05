import { prisma } from '@/lib/prisma'
import ConfirmationClient from './ConfirmationClient'
import { notFound } from 'next/navigation'
import { Booking, BookingStatus } from '@/lib/types'

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

interface Props { searchParams: { id?: string } }

export default async function ConfirmationPage({ searchParams }: Props) {
  const { id } = searchParams
  if (!id) return notFound()

  const raw = await prisma.booking.findUnique({ where: { id }, include: { service: true } })
  if (!raw) return notFound()

  const b = raw as unknown as PrismaBooking
  const booking: Booking = {
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
  }

  return <ConfirmationClient booking={booking} />
}

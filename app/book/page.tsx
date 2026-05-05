import { prisma } from '@/lib/prisma'
import BookingWizard from '@/components/booking/BookingWizard'
import { Service } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface PrismaService {
  id: string; name: string; price: number; duration: number
  description: string | null; isActive: boolean; createdAt: Date; updatedAt: Date
}

export default async function BookPage() {
  const raw = await prisma.service.findMany({ where: { isActive: true }, orderBy: { price: 'asc' } })
  const services: Service[] = (raw as PrismaService[]).map(s => ({
    id: s.id, name: s.name, price: s.price, duration: s.duration,
    description: s.description ?? null, isActive: s.isActive,
    createdAt: s.createdAt.toISOString(), updatedAt: s.updatedAt.toISOString(),
  }))
  return <BookingWizard services={services} />
}

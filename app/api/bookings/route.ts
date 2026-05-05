import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { notifyAdmin, notifyCustomer } from '@/lib/notifications'

const CreateBookingSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal('')),
  serviceId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    const status = searchParams.get('status')
    const where: Record<string, unknown> = {}
    if (date) where.date = date
    if (status) where.status = status
    const bookings = await prisma.booking.findMany({
      where,
      include: { service: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = CreateBookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'נתונים לא תקינים' }, { status: 400 })
    }
    const { name, phone, email, serviceId, date, time, notes } = parsed.data
    const service = await prisma.service.findUnique({ where: { id: serviceId } })
    if (!service) return NextResponse.json({ error: 'שירות לא נמצא' }, { status: 404 })
    const existing = await prisma.booking.findFirst({
      where: { date, time, status: { notIn: ['CANCELLED'] } },
    })
    if (existing) return NextResponse.json({ error: 'השעה כבר תפוסה' }, { status: 409 })
    const booking = await prisma.booking.create({
      data: { name: name.trim(), phone: phone.trim(), email: email?.trim() || null, serviceId, date, time, notes: notes?.trim() || null, status: 'PENDING' },
      include: { service: true },
    })

    // Fire-and-forget notifications (don't let failures block the response)
    const payload = {
      customerName:  booking.name,
      customerPhone: booking.phone,
      serviceName:   booking.service.name,
      date:          booking.date,
      time:          booking.time,
    }
    Promise.all([notifyAdmin(payload), notifyCustomer(payload)]).catch(console.error)

    return NextResponse.json(booking, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

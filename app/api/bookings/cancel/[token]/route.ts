import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyCustomerCancelled } from '@/lib/notifications'

export async function POST(_req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { cancelToken: params.token },
      include: { service: true },
    })
    if (!booking) return NextResponse.json({ error: 'לא נמצא' }, { status: 404 })
    if (booking.status === 'CANCELLED') return NextResponse.json({ error: 'already_cancelled' }, { status: 409 })
    if (booking.status === 'COMPLETED') return NextResponse.json({ error: 'already_completed' }, { status: 409 })

    await prisma.booking.update({ where: { id: booking.id }, data: { status: 'CANCELLED' } })

    notifyCustomerCancelled({
      customerName: booking.name,
      customerPhone: booking.phone,
      serviceName: booking.service.name,
      date: booking.date,
      time: booking.time,
    }).catch(console.error)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { cancelToken: params.token },
      include: { service: true },
    })
    if (!booking) return NextResponse.json({ error: 'לא נמצא' }, { status: 404 })
    return NextResponse.json({
      name: booking.name,
      serviceName: booking.service.name,
      date: booking.date,
      time: booking.time,
      status: booking.status,
    })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

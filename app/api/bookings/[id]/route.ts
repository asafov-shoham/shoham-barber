import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyCustomerApproved, notifyCustomerRejected } from '@/lib/notifications'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { status, ...rest } = body

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: { status, ...rest },
      include: { service: true },
    })

    // Send WhatsApp when admin changes status
    if (status) {
      const payload = {
        id: booking.id,
        cancelToken: booking.cancelToken ?? undefined,
        customerName: booking.name,
        customerPhone: booking.phone,
        serviceName: booking.service.name,
        date: booking.date,
        time: booking.time,
      }
      if (status === 'CONFIRMED') notifyCustomerApproved(payload).catch(console.error)
      if (status === 'CANCELLED')  notifyCustomerRejected(payload).catch(console.error)
    }

    return NextResponse.json(booking)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.booking.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

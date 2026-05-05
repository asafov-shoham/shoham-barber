import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

    // Booked times
    const bookings = await prisma.booking.findMany({
      where: { date, status: { notIn: ['CANCELLED'] } },
      select: { time: true },
    })

    // Blocked slots for this date
    const blockedSlots = await prisma.blockedSlot.findMany({ where: { date } })

    // Is entire day blocked?
    const isDayBlocked = blockedSlots.some((s) => !s.startTime && !s.endTime)

    return NextResponse.json({
      bookedSlots: bookings.map((b: { time: string }) => b.time),
      isDayBlocked,
      blockedRanges: blockedSlots
        .filter((s) => s.startTime && s.endTime)
        .map((s) => ({ startTime: s.startTime, endTime: s.endTime })),
    })
  } catch {
    return NextResponse.json({ bookedSlots: [], isDayBlocked: false, blockedRanges: [] })
  }
}

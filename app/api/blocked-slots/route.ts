import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/blocked-slots?from=yyyy-MM-dd&to=yyyy-MM-dd
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const from = searchParams.get('from')
    const to   = searchParams.get('to')
    const where: Record<string, unknown> = {}
    if (from && to) {
      where.date = { gte: from, lte: to }
    }
    const slots = await prisma.blockedSlot.findMany({
      where,
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    })
    return NextResponse.json(slots)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

// POST /api/blocked-slots  { date, startTime?, endTime?, reason? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { date, startTime, endTime, reason } = body
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'date required (yyyy-MM-dd)' }, { status: 400 })
    }
    const slot = await prisma.blockedSlot.create({
      data: {
        date,
        startTime: startTime || null,
        endTime:   endTime   || null,
        reason:    reason    || null,
      },
    })
    return NextResponse.json(slot, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

// DELETE /api/blocked-slots?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.blockedSlot.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

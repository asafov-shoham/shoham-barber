import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT = { workingDays: '0,1,2,3,4,5', startHour: 9, endHour: 19, slotMinutes: 30 }

async function getSchedule() {
  let s = await prisma.workingSchedule.findFirst()
  if (!s) s = await prisma.workingSchedule.create({ data: DEFAULT })
  return s
}

export async function GET() {
  try {
    return NextResponse.json(await getSchedule())
  } catch {
    return NextResponse.json(DEFAULT)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    let s = await prisma.workingSchedule.findFirst()
    if (!s) {
      s = await prisma.workingSchedule.create({ data: { ...DEFAULT, ...body } })
    } else {
      s = await prisma.workingSchedule.update({ where: { id: s.id }, data: body })
    }
    return NextResponse.json(s)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

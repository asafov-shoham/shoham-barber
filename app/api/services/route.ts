import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const Schema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  duration: z.number().int().positive(),
  description: z.string().nullable().optional(),
})

export async function GET() {
  try {
    const services = await prisma.service.findMany({ where: { isActive: true }, orderBy: { createdAt: 'asc' } })
    return NextResponse.json(services)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    const { name, price, duration, description } = parsed.data
    const service = await prisma.service.create({ data: { name, price, duration, description: description ?? null } })
    return NextResponse.json(service, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

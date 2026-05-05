import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULTS = [
  { key: 'hero_badge',         value: 'ספר גברים מצפה רמון',                                              label: 'תגית ה-Hero (למעלה)' },
  { key: 'hero_main',          value: 'כל תספורת היא יצירה, וכל ביקור הוא חוויה',                        label: 'כותרת ראשית' },
  { key: 'hero_cta_primary',   value: 'הזמן תור עכשיו',                                                   label: 'כפתור ראשי' },
  { key: 'hero_cta_secondary', value: 'לצפייה בשירותים',                                                  label: 'כפתור משני' },
  { key: 'stat_clients',       value: '+50',                                                               label: 'מספר לקוחות' },
  { key: 'stat_clients_label', value: 'לקוחות מרוצים',                                                    label: 'תווית לקוחות' },
  { key: 'services_title',     value: 'השירותים שלנו',                                                    label: 'כותרת שירותים' },
  { key: 'services_cta',       value: 'הזמן כל שירות',                                                    label: 'כפתור שירותים' },
  { key: 'location_title',     value: 'בוא לבקר',                                                         label: 'כותרת מיקום' },
  { key: 'location_desc',      value: 'אנחנו ממוקמים בלב מצפה רמון. בואו ספונטנית או הזמינו תור מראש.', label: 'תיאור מיקום' },
  { key: 'address',            value: 'רחוב הראשי 1, מצפה רמון',                                         label: 'כתובת' },
  { key: 'hours',              value: 'ראשון–חמישי: 09:00–19:00\nשישי: 09:00–15:00\nשבת: סגור',         label: 'שעות פתיחה' },
  { key: 'phone',              value: '050-123-4567',                                                      label: 'טלפון' },
  { key: 'cta_title',          value: 'מוכן להיראות במיטבך?',                                             label: 'כותרת CTA תחתון' },
  { key: 'cta_subtitle',       value: 'הזמן תור תוך פחות מדקה. ללא צורך בחשבון.',                       label: 'תת-כותרת CTA תחתון' },
  { key: 'cta_button',         value: 'הזמן עכשיו — בחינם',                                               label: 'כפתור CTA תחתון' },
  { key: 'footer_name',        value: 'שוהם ברבר שופ',                                                    label: 'שם העסק' },
  { key: 'instagram_url',      value: '',                                                                  label: 'קישור לאינסטגרם (הכנס URL מלא)' },
  { key: 'tiktok_url',         value: '',                                                                  label: 'קישור לטיקטוק (הכנס URL מלא)' },
]

async function ensureDefaults() {
  for (const d of DEFAULTS) {
    await prisma.siteContent.upsert({ where: { key: d.key }, update: {}, create: d })
  }
}

export async function GET() {
  try {
    await ensureDefaults()
    const rows = await prisma.siteContent.findMany()
    const obj: Record<string, string> = {}
    rows.forEach((r: { key: string; value: string }) => { obj[r.key] = r.value })
    return NextResponse.json(obj)
  } catch {
    return NextResponse.json({})
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const updates: Record<string, string> = await req.json()
    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        prisma.siteContent.updateMany({ where: { key }, data: { value } })
      )
    )
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

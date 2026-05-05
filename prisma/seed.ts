import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.service.count()
  if (existing > 0) {
    console.log('✅ דאטאבייס כבר מאותחל — לא מאפס נתונים קיימים')
    return
  }

  const services = await Promise.all([
    prisma.service.create({ data: { name: 'תספורת קלאסית',     price: 80,  duration: 30, description: 'תספורת מדויקת המותאמת לסגנון שלך. כולל ייעוץ, שטיפה ועיצוב.' } }),
    prisma.service.create({ data: { name: 'פייד חתימה',         price: 100, duration: 45, description: 'טכניקת פייד אמנותית עם קווים חדים. השירות הכי מבוקש שלנו.' } }),
    prisma.service.create({ data: { name: 'עיצוב זקן',          price: 60,  duration: 25, description: 'עיצוב זקן מקצועי עם מגבת חמה לגימור מושלם.' } }),
    prisma.service.create({ data: { name: 'חבילת הפינוק המלאה', price: 150, duration: 75, description: 'תספורת + פייד + עיצוב זקן + גילוח עם מגבת חמה.' } }),
  ])

  const fmt = (d: Date) => d.toISOString().split('T')[0]
  const today = new Date()
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)

  await Promise.all([
    prisma.booking.create({ data: { name: 'דוד כהן',   phone: '050-111-1111', serviceId: services[1].id, date: fmt(today),    time: '10:00', status: 'CONFIRMED' } }),
    prisma.booking.create({ data: { name: 'יוסף לוי',   phone: '050-222-2222', serviceId: services[3].id, date: fmt(today),    time: '11:30', status: 'PENDING'   } }),
    prisma.booking.create({ data: { name: 'אבי בן דוד', phone: '050-333-3333', serviceId: services[0].id, date: fmt(today),    time: '14:00', status: 'COMPLETED' } }),
    prisma.booking.create({ data: { name: 'משה שפירו',  phone: '050-444-4444', serviceId: services[2].id, date: fmt(tomorrow), time: '09:00', status: 'PENDING'   } }),
    prisma.booking.create({ data: { name: 'ערן כץ',     phone: '050-555-5555', serviceId: services[1].id, date: fmt(tomorrow), time: '12:00', status: 'CONFIRMED' } }),
  ])

  console.log('✅ דאטאבייס אותחל בהצלחה')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())

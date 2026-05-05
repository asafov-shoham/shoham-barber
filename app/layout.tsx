import type { Metadata } from 'next'
import { Frank_Ruhl_Libre, Heebo } from 'next/font/google'
import './globals.css'
import AccessibilityWidget from '@/components/AccessibilityWidget'

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-display',
  display: 'swap',
})

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'שוהם ברבר שופ — תספורות פרימיום מצפה רמון',
  description: 'חווית גילוח ותספורת פרימיום בשוהם ברבר שופ. מספרה מקצועית במצפה רמון. הזמן תור עכשיו אונליין.',
  keywords: ['מספרה', 'תספורת', 'מצפה רמון', 'פייד', 'זקן', 'גילוח'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${frankRuhl.variable} ${heebo.variable}`}>
      <body className="bg-obsidian text-white font-sans antialiased">
        {children}
        <AccessibilityWidget />
      </body>
    </html>
  )
}

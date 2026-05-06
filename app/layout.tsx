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

        {/* Skip to main content — WCAG 2.4.1 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
          style={{ background: '#C9A84C', color: '#0A0A0A' }}
        >
          דלג לתוכן הראשי
        </a>

        <main id="main-content" role="main" tabIndex={-1}>
          {children}
        </main>

        <AccessibilityWidget />

        {/* Footer links — נגישות ותנאי שימוש */}
        <div
          className="fixed bottom-0 left-0 right-0 flex justify-center gap-4 py-2 text-xs z-30 pointer-events-none"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <a href="/accessibility" className="pointer-events-auto hover:opacity-60 transition-opacity" style={{ color: 'rgba(255,255,255,0.25)' }}>
            הצהרת נגישות
          </a>
          <span>·</span>
          <a href="/terms" className="pointer-events-auto hover:opacity-60 transition-opacity" style={{ color: 'rgba(255,255,255,0.25)' }}>
            תנאי שימוש
          </a>
        </div>

      </body>
    </html>
  )
}

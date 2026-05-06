import Link from 'next/link'

export const metadata = {
  title: 'הצהרת נגישות — ספרייה שוהם',
  description: 'הצהרת הנגישות של ספרייה שוהם בהתאם לתקן ישראלי 5568',
}

export default function AccessibilityPage() {
  const year = new Date().getFullYear()
  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A', color: '#E5E5E5' }}>
      <div className="max-w-3xl mx-auto px-6 py-16" dir="rtl">

        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10 hover:opacity-80 transition-opacity" style={{ color: '#C9A84C' }}>
          → חזרה לאתר
        </Link>

        <div className="mb-12 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-4xl mb-4">♿</div>
          <h1 className="text-4xl font-bold mb-2">הצהרת נגישות</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
            בהתאם לתקן ישראלי (ת"י) 5568 ורגולציית שוויון זכויות לאנשים עם מוגבלות
          </p>
        </div>

        <div className="space-y-10" style={{ lineHeight: '1.9', fontSize: '15px', color: 'rgba(255,255,255,0.75)' }}>

          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#E8C97D' }}>מחויבותנו לנגישות</h2>
            <p>ספרייה שוהם מחויבת לאפשר לכלל האוכלוסייה, לרבות אנשים עם מוגבלות, להשתמש באתר ובשירות קביעת התורים בצורה שוויונית, מכובדת, עצמאית ונגישה. אנו פועלים לעמוד בדרישות תקן ישראלי 5568 ברמת AA של WCAG 2.1.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#E8C97D' }}>אמצעי הנגישות באתר</h2>
            <ul className="space-y-3 pr-5" style={{ listStyleType: 'disc' }}>
              <li>תפריט נגישות הנגיש בלחיצה על כפתור הנגישות בפינה השמאלית התחתונה של המסך</li>
              <li>אפשרות להגדלת גודל הגופן עד 160%</li>
              <li>מצב ניגודיות גבוהה לנוחות קריאה</li>
              <li>מצב גווני אפור</li>
              <li>הדגשת קישורים</li>
              <li>עצירת אנימציות</li>
              <li>מדריך קריאה</li>
              <li>סמן מוגדל</li>
              <li>תמיכה בניווט מקלדת</li>
              <li>קישור דילוג לתוכן המרכזי</li>
              <li>תגיות ARIA לסיוע בקוראי מסך</li>
              <li>כיוון כתיבה מימין לשמאל (RTL) מלא</li>
              <li>שפת האתר מוגדרת כעברית</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#E8C97D' }}>רמת הנגישות</h2>
            <p>האתר עומד ברמת AA של תקן WCAG 2.1 ובדרישות תקן ישראלי 5568. הבדיקות בוצעו על ידי כלים אוטומטיים ובדיקה ידנית.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#E8C97D' }}>מה לא נגיש</h2>
            <p>אנו עושים מאמץ לספק חוויה נגישה מלאה. ייתכן כי קיימים אזורים אשר טרם הונגשו במלואם. אם נתקלת בבעיה — אנא צור קשר ונפעל לתקנה.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#E8C97D' }}>יצירת קשר בנושא נגישות</h2>
            <p className="mb-3">אם נתקלת בבעיית נגישות כלשהי, אם ברצונך לקבל מידע בפורמט נגיש אחר, או אם יש לך הצעות לשיפור — פנה אלינו:</p>
            <div className="p-5 rounded-xl space-y-2" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <p><strong style={{ color: '#E8C97D' }}>שם רכז הנגישות:</strong> שוהם</p>
              <p><strong style={{ color: '#E8C97D' }}>דרך יצירת קשר:</strong> וואטסאפ ישיר</p>
              <p><strong style={{ color: '#E8C97D' }}>זמן מענה:</strong> עד 5 ימי עסקים</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#E8C97D' }}>עדכון ההצהרה</h2>
            <p>הצהרה זו עודכנה לאחרונה בשנת {year}. אנו מתחייבים לסקור ולעדכן הצהרה זו בהתאם לשינויים באתר.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>
          ספרייה שוהם · כל הזכויות שמורות · {year}
        </div>

      </div>
    </div>
  )
}

import Link from 'next/link'

export default function TermsPage() {
  const today = new Date().toLocaleDateString('he-IL')
  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A', color: '#E5E5E5' }}>
      <div className="max-w-3xl mx-auto px-6 py-16" dir="rtl">

        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10 hover:opacity-80 transition-opacity" style={{ color: '#C9A84C' }}>
          → חזרה לאתר
        </Link>

        {/* Header */}
        <div className="mb-12 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-4xl mb-4">💈</div>
          <h1 className="text-4xl font-bold mb-2">תקנון ומדיניות פרטיות</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>עודכן לאחרונה: {today}</p>
        </div>

        {/* Content */}
        <div className="space-y-10" style={{ lineHeight: '1.9', fontSize: '15px', color: 'rgba(255,255,255,0.75)' }}>

          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#E8C97D' }}>1. כללי</h2>
            <p>ספרייה שוהם ("העסק", "אנחנו") מפעיל אתר זה לצורך קביעת תורים בלבד. השימוש באתר ובשירות קביעת התורים מהווה הסכמה לתנאים המפורטים להלן. אם אינך מסכים לתנאים, אנא הימנע משימוש בשירות.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#E8C97D' }}>2. השירות</h2>
            <p>האתר מאפשר ללקוחות לקבוע תורים בספרייה. קביעת תור באמצעות האתר אינה מהווה חוזה מחייב, ועלולה להיות כפופה לאישור מצד העסק. העסק שומר לעצמו את הזכות לבטל תור בהתראה מוקדמת.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#E8C97D' }}>3. איסוף מידע</h2>
            <p className="mb-3">בעת קביעת תור, אנו אוספים את המידע הבא:</p>
            <ul className="space-y-2 pr-5" style={{ listStyleType: 'disc' }}>
              <li>שם מלא — לזיהוי הלקוח בתור</li>
              <li>מספר טלפון — לצורך יצירת קשר ושליחת תזכורות</li>
              <li>כתובת אימייל (אופציונלי) — לצורך עדכונים</li>
              <li>תאריך ושעת התור — לניהול יומן העבודה</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#E8C97D' }}>4. שימוש במידע</h2>
            <p className="mb-3">המידע שנאסף ישמש אך ורק למטרות הבאות:</p>
            <ul className="space-y-2 pr-5" style={{ listStyleType: 'disc' }}>
              <li>ניהול התור ויצירת קשר לגבי מועד הביקור</li>
              <li>שליחת אישור ותזכורת לתור בוואטסאפ</li>
              <li>ניהול פנימי של יומן העבודה</li>
            </ul>
            <p className="mt-3"><strong style={{ color: 'rgba(255,255,255,0.9)' }}>לא נמכור, לא נשתף ולא נעביר את פרטיך לצדדים שלישיים</strong>, למעט ספקי שירות טכניים הנדרשים להפעלת האתר (כגון Twilio לשליחת הודעות וואטסאפ).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#E8C97D' }}>5. אבטחת מידע</h2>
            <p>אנו נוקטים אמצעים סבירים להגנה על המידע האישי שנמסר לנו. המידע מאוחסן בשרתים מאובטחים ומוצפנים. יחד עם זאת, אין אנו יכולים להבטיח אבטחה מוחלטת של כל מידע המועבר באינטרנט.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#E8C97D' }}>6. שמירת מידע</h2>
            <p>המידע יישמר לתקופה הנדרשת לצורך מתן השירות ולא יותר מ-12 חודשים לאחר מועד התור האחרון. לאחר מכן, המידע יימחק או יוגדר כאנונימי.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#E8C97D' }}>7. זכויות הלקוח</h2>
            <p className="mb-3">בהתאם לחוק הגנת הפרטיות, התשמ"א-1981, הלקוח זכאי:</p>
            <ul className="space-y-2 pr-5" style={{ listStyleType: 'disc' }}>
              <li>לעיין במידע האישי שנשמר עליו</li>
              <li>לבקש תיקון מידע שגוי</li>
              <li>לבקש מחיקת המידע</li>
            </ul>
            <p className="mt-3">לבקשות ניתן לפנות ישירות לספרייה.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#E8C97D' }}>8. ביטול תורים</h2>
            <p>ניתן לבטל תור עד 2 שעות לפני המועד הנקוב, על ידי יצירת קשר ישיר עם הספרייה. ביטול שלא במועד עלול לגרור חיוב על פי שיקול דעת העסק.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#E8C97D' }}>9. שינויים בתקנון</h2>
            <p>העסק שומר לעצמו את הזכות לשנות תקנון זה בכל עת. שינויים מהותיים יפורסמו באתר. המשך השימוש באתר לאחר פרסום שינויים מהווה הסכמה לתקנון המעודכן.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#E8C97D' }}>10. יצירת קשר</h2>
            <p>לכל שאלה בנוגע לתקנון זה או לנושא הגנת הפרטיות, ניתן לפנות אלינו ישירות דרך וואטסאפ.</p>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>
          ספרייה שוהם · כל הזכויות שמורות · {new Date().getFullYear()}
        </div>

      </div>
    </div>
  )
}

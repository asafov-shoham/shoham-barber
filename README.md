# 💈 Shoham Barber Shop

A premium, production-ready barber appointment booking system built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

![Preview](https://via.placeholder.com/1200x630/0A0A0A/C9A84C?text=Shoham+Barber+Shop)

---

## ✨ Features

### Customer Side
- **Luxury Landing Page** — Hero section, services preview, testimonials, location map
- **5-Step Booking Wizard** — Service → Date → Time → Details → Review
- **Real-time Slot Availability** — Booked slots shown crossed-out automatically
- **Confirmation Page** — Success animation, booking summary, WhatsApp share

### Admin Dashboard (`/admin`)
- **Overview Panel** — Today's stats, quick appointment list
- **Bookings Table** — Search, filter by status, click-to-detail panel
- **Status Management** — Mark as Confirmed / Completed / Cancelled, delete
- **Services Manager** — Create, edit, delete services with a modal form
- **Analytics Panel** — Bookings over 14 days, peak hours, service breakdown charts

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/shoham-barber.git
cd shoham-barber
npm install
```

### 2. Environment Setup

The `.env` file is already configured for local SQLite development:

```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="shoham2024"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="972501234567"
```

### 3. Database Setup

```bash
# Push the schema to SQLite
npm run db:push

# Seed with demo data (services + sample bookings)
npm run db:seed
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/book` | Booking wizard |
| `/confirmation?id=xxx` | Booking confirmation |
| `/admin` | Admin dashboard |

---

## 🗄️ Database

Uses **SQLite** locally (zero setup) via Prisma ORM.

```bash
# View database in browser UI
npm run db:studio

# Reset and re-seed
npx prisma db push --force-reset
npm run db:seed
```

### Schema

**Booking**
| Field | Type |
|-------|------|
| id | cuid |
| name | String |
| phone | String |
| email | String? |
| serviceId | String (FK) |
| date | String (YYYY-MM-DD) |
| time | String (HH:MM) |
| status | PENDING \| CONFIRMED \| COMPLETED \| CANCELLED |
| notes | String? |
| createdAt | DateTime |

**Service**
| Field | Type |
|-------|------|
| id | cuid |
| name | String |
| price | Float |
| duration | Int (minutes) |
| description | String? |
| isActive | Boolean |

---

## 🌐 Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/shoham-barber
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repository
3. Framework: **Next.js** (auto-detected)

### 3. Configure Environment Variables

In Vercel → Settings → Environment Variables, add:

```
DATABASE_URL          postgresql://user:pass@host:5432/shoham_barber
ADMIN_PASSWORD        your-secure-password
NEXT_PUBLIC_APP_URL   https://your-domain.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMBER  972501234567
```

### 4. PostgreSQL for Production

Use [Neon](https://neon.tech) (free tier) or [Supabase](https://supabase.com):

```bash
# Update schema for PostgreSQL
# In prisma/schema.prisma, change:
# provider = "sqlite" → provider = "postgresql"

# Run migrations
npx prisma db push
npm run db:seed
```

### 5. Deploy

Click **Deploy** in Vercel. Your site will be live in ~2 minutes.

---

## 🏗️ Project Structure

```
shoham-barber/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout (fonts, metadata)
│   ├── globals.css                 # Global styles + Tailwind
│   ├── book/
│   │   └── page.tsx               # Booking wizard page (server)
│   ├── confirmation/
│   │   ├── page.tsx               # Confirmation page (server)
│   │   └── ConfirmationClient.tsx # Client component
│   ├── admin/
│   │   └── page.tsx               # Admin dashboard (server)
│   └── api/
│       ├── bookings/
│       │   ├── route.ts           # GET all, POST create
│       │   ├── [id]/route.ts      # GET, PATCH, DELETE by ID
│       │   └── slots/route.ts     # GET booked slots for a date
│       └── services/
│           ├── route.ts           # GET all, POST create
│           └── [id]/route.ts      # PATCH, DELETE by ID
├── components/
│   ├── booking/
│   │   ├── BookingWizard.tsx      # Main wizard container
│   │   ├── ServiceStep.tsx        # Step 1: Choose service
│   │   ├── DateStep.tsx           # Step 2: Pick date
│   │   ├── TimeStep.tsx           # Step 3: Pick time
│   │   ├── DetailsStep.tsx        # Step 4: Enter details
│   │   └── ReviewStep.tsx         # Step 5: Review & confirm
│   └── admin/
│       ├── AdminDashboard.tsx     # Main admin layout
│       ├── BookingsTable.tsx      # Bookings list + detail panel
│       ├── ServicesPanel.tsx      # Services CRUD
│       └── AnalyticsPanel.tsx     # Charts & analytics
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   ├── utils.ts                   # Utility functions
│   └── types.ts                   # TypeScript interfaces
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Demo data seeder
├── .env                           # Local environment variables
├── .env.example                   # Environment variable template
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0A0A0A` (Obsidian) |
| Surface | `#141414` |
| Gold | `#C9A84C` |
| Gold Light | `#E8C97D` |
| Display Font | Cormorant Garamond |
| Body Font | Outfit |
| Border | `rgba(255,255,255,0.06)` |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Database | SQLite (dev) / PostgreSQL (prod) |
| ORM | Prisma |
| Charts | Recharts |
| Date Picker | react-day-picker |
| Icons | lucide-react |
| Fonts | Google Fonts (Cormorant + Outfit) |

---

## 🔐 Admin Access

Visit `/admin` — no login required in this MVP.

To add authentication, you can integrate [NextAuth.js](https://next-auth.js.org/) or protect the route with middleware:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const auth = req.cookies.get('admin_auth')
    if (!auth) return NextResponse.redirect(new URL('/login', req.url))
  }
}
```

---

## 📄 License

MIT — free to use and modify for commercial projects.

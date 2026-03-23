# QuickFix Windshields — Doorstep Windshield Service Website

## Project Overview
Lead generation website for a premium doorstep windshield repair and replacement service. Customers get an instant quote, select a time slot, and submit their contact details. A coordinator calls within 2 hours to confirm.

## Business Details
- **Business name**: QuickFix Windshields
- **Website**: www.quickfixwindshields.co
- **Email**: hello@quickfixwindshields.co
- **Service types**: Chip repair, crack repair, front windshield replacement, rear/door glass replacement, ADAS recalibration
- **Mobile service**: Technician comes to customer's location (home, office, parking lot)
- **Coverage**: **Bengaluru only** — all 560xxx PIN codes are served by default (API fallback logic). No need to add individual PINs unless a surcharge applies.

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui (manually written, no CLI)
- **Fonts**: Inter (body), Playfair Display (headings — serif, with italic emphasis pattern)
- **Forms**: React Hook Form + Zod
- **Database**: Neon Postgres via Drizzle ORM
- **Rate limiting**: Upstash Redis (`@upstash/ratelimit`)
- **Analytics**: Meta Pixel (client) + server-side event log
- **Package Manager**: **pnpm** (not npm)
- **Deploy**: Vercel, region `bom1` (Mumbai)

## Project Structure
```
quickfix/
├── app/
│   ├── layout.tsx          # Root layout: fonts, Schema.org JSON-LD, MetaPixel
│   ├── page.tsx            # Landing page (composes section components)
│   ├── globals.css         # Tailwind base + CSS custom properties
│   ├── booking/page.tsx    # 4-step booking funnel
│   ├── privacy/page.tsx    # Privacy Policy
│   ├── terms/page.tsx      # Terms of Service
│   └── api/
│       ├── quote/          # GET vehicle list | POST price lookup (rate-limited)
│       ├── availability/   # GET open slots by PIN code (560* fallback)
│       ├── leads/          # POST lead submission + attribution
│       └── track/          # POST funnel event logging
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Header, Footer
│   ├── sections/           # Landing page sections
│   └── booking/            # BookingStore (context), BookingForm, step components
├── lib/
│   ├── utils.ts            # cn(), formatINR(), generateSessionId()
│   ├── attribution.ts      # UTM/fbclid capture → sessionStorage
│   ├── meta-events.ts      # fbq() wrappers
│   ├── rate-limit.ts       # Upstash sliding-window rate limiter (fail-open)
│   └── db/                 # Drizzle client, schema, migrate, seed
├── types/index.ts          # Shared TypeScript interfaces (BookingState, etc.)
├── drizzle.config.ts
├── vercel.json             # Region bom1
└── SETUP.md                # Full setup and deployment guide
```

## Development Commands
```bash
pnpm dev          # Dev server at localhost:3000 (Turbopack)
pnpm build        # Production build
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit

pnpm db:generate  # Generate Drizzle migrations from schema changes
pnpm db:migrate   # Apply migrations to Neon
pnpm db:seed      # Seed vehicles, PIN codes, availability slots
```

## Conventions
- Use TypeScript strictly — no `any` types
- Tailwind for all styling — no CSS modules or styled-components
- Server Components by default; only use `"use client"` for forms and interactive components
- Keep components focused and small; compose sections from smaller pieces
- Images: use `next/image` for all images
- Links: use `next/link` for internal navigation

## SEO
- Each page must have `metadata` (title, description) exported at the top
- Semantic HTML: use proper heading hierarchy (h1 > h2 > h3)
- Schema.org `LocalBusiness` structured data on home page (in `app/layout.tsx`)

## Design Direction (azure_concierge theme)
- **Palette**: Black (#000) primary CTAs, white/stone backgrounds, teal (#00C9A7) for success/guarantee states
- **Typography**: Playfair Display serif for headings (italic emphasis on key word per heading), Inter for body
- **Mobile-first** responsive design; desktop gets split layouts (form + summary side-by-side)
- **CTAs**: Black uppercase buttons with letter-spacing (e.g. "GET FREE QUOTE →")
- Headings follow the pattern: main word + *italic emphasis word* (e.g. "Effortless *Restoration*")

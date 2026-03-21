# QuickFix Auto Glass

Premium doorstep windshield repair and replacement service targeting high-income car owners in Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, and Pune. Customers book online; a certified technician comes to their location.

**Goal:** Lead generation funnel. Every page decision optimises for one outcome — a submitted booking.

---

## What It Does

| Page | Purpose |
|------|---------|
| `/` | Marketing landing page — trust signals, services, testimonials, CTAs |
| `/booking` | 4-step booking funnel — vehicle → schedule → contact → confirmation |
| `/api/quote` | Returns INR price for a given vehicle (rate-limited) |
| `/api/availability` | Returns open 2-hr slots for a PIN code (next 7 days) |
| `/api/leads` | Persists a completed booking + attribution data |
| `/api/track` | Server-side funnel event logging |

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 |
| UI primitives | shadcn/ui (manually written, no CLI) |
| Forms | React Hook Form + Zod |
| Database | Neon (Postgres, serverless) via Drizzle ORM |
| Rate limiting | Upstash Redis (`@upstash/ratelimit`) |
| Analytics | Meta Pixel (client-side) + server-side event log |
| Deploy | Vercel (region: `bom1` — Mumbai) |
| Package manager | pnpm |

---

## Project Structure

```
quickfix/
├── app/
│   ├── layout.tsx          # Root layout: fonts, Schema.org JSON-LD, MetaPixel
│   ├── page.tsx            # Landing page (composes section components)
│   ├── globals.css         # Tailwind base + CSS custom properties
│   ├── booking/
│   │   └── page.tsx        # Booking funnel page (wraps BookingProvider)
│   └── api/
│       ├── quote/          # GET vehicle list | POST price lookup
│       ├── availability/   # GET open slots by PIN code
│       ├── leads/          # POST lead submission
│       └── track/          # POST funnel event
│
├── components/
│   ├── ui/                 # shadcn/ui primitives (button, input, select…)
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── sections/           # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── TrustSignals.tsx
│   │   ├── Testimonials.tsx
│   │   └── CoverageStrip.tsx
│   ├── booking/
│   │   ├── BookingStore.tsx       # Context + useReducer for form state
│   │   ├── BookingForm.tsx        # Step container + progress bar
│   │   └── steps/
│   │       ├── VehicleStep.tsx    # Year/make/model selects + live quote
│   │       ├── LocationStep.tsx   # PIN code, address, date, time slot
│   │       ├── ContactStep.tsx    # Name, mobile, email
│   │       └── ConfirmationStep.tsx # Lead submit + payment info
│   └── MetaPixel.tsx
│
├── lib/
│   ├── utils.ts            # cn(), formatINR(), generateSessionId()
│   ├── attribution.ts      # UTM / fbclid capture → sessionStorage
│   ├── meta-events.ts      # fbq() wrappers (trackQuoteView, trackLeadSubmit…)
│   ├── rate-limit.ts       # Upstash sliding-window rate limiter (fail-open)
│   └── db/
│       ├── index.ts        # Drizzle client (Neon HTTP)
│       ├── schema.ts       # All table definitions
│       ├── migrate.ts      # Migration runner (tsx lib/db/migrate.ts)
│       └── seed.ts         # Seed: vehicles, PIN codes, availability slots
│
├── types/
│   └── index.ts            # Shared TypeScript interfaces
│
├── .env.example            # All required env vars with descriptions
├── drizzle.config.ts       # Drizzle Kit config
├── vercel.json             # Vercel region config (bom1)
└── CLAUDE.md               # AI agent instructions (conventions, constraints)
```

---

## Key Design Decisions

**Single-page booking funnel** — state lives in React Context + sessionStorage (not URL params). This avoids full page reloads between steps and preserves state on accidental refresh.

**Server Components by default** — only booking steps and header use `"use client"`. Landing page sections are pure server components.

**Fail-open rate limiting** — if Upstash is unavailable the quote API still responds. Prevents Redis outages from blocking sales.

**Attribution at lead level** — UTM params and `fbclid` are captured on first page load and persisted to every lead record. This connects Meta ad spend to actual bookings.

**India-specific** — PIN codes (6-digit), INR currency, 10-digit mobile validation (starts 6–9), UPI/card/cash payment methods.

---

## Development Commands

```bash
pnpm dev          # Dev server at localhost:3000 (Turbopack)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit

pnpm db:generate  # Generate Drizzle migrations from schema
pnpm db:migrate   # Apply migrations to Neon
pnpm db:seed      # Seed vehicles, PIN codes, availability slots
```

See **[SETUP.md](./SETUP.md)** for full environment setup and deployment guide.

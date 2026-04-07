# QuickFix Windshields

Premium doorstep windshield repair and replacement service in Bengaluru. Customers book online in under 60 seconds; a certified technician arrives at their home or office.

**Website**: [www.quickfixwindshields.co](https://www.quickfixwindshields.co)
**Email**: hello@quickfixwindshields.co

**Goal:** Lead generation funnel. Every page decision optimises for one outcome — a submitted booking.

---

## What It Does

| Page | Purpose |
|------|---------|
| `/` | Marketing landing page — trust signals, services, process, testimonials, coverage |
| `/booking` | 3-step quote request flow — vehicle → contact → confirmation |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/api/quote` | Returns INR price for a given vehicle (rate-limited) |
| `/api/availability` | Returns open 2-hr slots for a PIN code (560* Bengaluru coverage) |
| `/api/leads` | Persists a completed booking + attribution data |
| `/api/track` | Server-side funnel event logging |

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 |
| UI primitives | shadcn/ui (manually written) |
| Fonts | Inter (body) + Playfair Display (headings, serif) |
| Forms | React Hook Form + Zod |
| Database | Neon (Postgres, serverless) via Drizzle ORM |
| Rate limiting | Upstash Redis (`@upstash/ratelimit`) |
| Analytics | Meta Pixel + server-side event log |
| Deploy | Vercel (region: `bom1` — Mumbai) |
| Package manager | pnpm |

---

## Service Coverage

Currently serving **Bengaluru only**. The availability API accepts any PIN code beginning with `560` — no individual PIN entries required. Specific surcharges for outer areas can be added to the `service_pin_coverage` table.

---

## Project Structure

```
quickfix/
├── app/
│   ├── layout.tsx              # Root layout: fonts, Schema.org JSON-LD, MetaPixel
│   ├── page.tsx                # Landing page (composes section components)
│   ├── globals.css             # Tailwind base + CSS custom properties (azure_concierge theme)
│   ├── booking/page.tsx        # 4-step booking funnel
│   ├── privacy/page.tsx        # Privacy Policy
│   ├── terms/page.tsx          # Terms of Service
│   └── api/
│       ├── quote/route.ts      # GET vehicle list | POST price lookup
│       ├── availability/route.ts  # GET open slots by PIN (560* fallback)
│       ├── leads/route.ts      # POST lead submission
│       └── track/route.ts      # POST funnel event
│
├── components/
│   ├── ui/                     # shadcn/ui primitives (button, input, select, card…)
│   ├── layout/
│   │   ├── Header.tsx          # White sticky header, hamburger mobile menu
│   │   └── Footer.tsx          # Light footer, payment badges, legal links
│   ├── sections/               # Landing page sections
│   │   ├── Hero.tsx            # Split desktop / stacked mobile
│   │   ├── Services.tsx
│   │   ├── HowItWorks.tsx      # Faded step numbers (01/02/03)
│   │   ├── TrustSignals.tsx    # Dark section with teal checkmarks
│   │   ├── Testimonials.tsx    # Exec-persona testimonials
│   │   └── CoverageStrip.tsx   # Bengaluru focus strip
│   ├── booking/
│   │   ├── BookingStore.tsx    # Context + useReducer — all funnel state
│   │   ├── BookingForm.tsx     # Tab-style progress + step routing
│   │   └── steps/
│   │       ├── VehicleStep.tsx      # 5 brand tiles + inline "Other" make dropdown + model/year/glass
│   │       ├── ContactStep.tsx      # Form + booking summary card (desktop)
│   │       └── ConfirmationStep.tsx # Auto-submit, dark arrival card, payment info
│   └── MetaPixel.tsx
│
├── lib/
│   ├── utils.ts            # cn(), formatINR(), generateSessionId()
│   ├── attribution.ts      # UTM / fbclid capture → sessionStorage
│   ├── meta-events.ts      # fbq() wrappers (trackQuoteView, trackLeadSubmit…)
│   ├── rate-limit.ts       # Upstash sliding-window rate limiter (fail-open)
│   └── db/
│       ├── index.ts        # Drizzle + Neon HTTP client
│       ├── schema.ts       # All table definitions
│       ├── migrate.ts      # Migration runner
│       ├── seed.ts         # Seed: parses car_list_india.csv + PINs + availability slots
│       └── car_list_india.csv  # 229-vehicle catalog (Make, Model, Category)
│
├── types/index.ts          # Shared TS types (BookingState, LeadRequest, etc.)
├── .env.example            # All required env vars with descriptions
├── drizzle.config.ts       # Drizzle Kit config
└── vercel.json             # Vercel region config (bom1)
```

---

## Key Design Decisions

**azure_concierge theme** — black/white/teal palette, Playfair Display serif headings with italic emphasis pattern (`"Effortless` *`Restoration`*`"`). No navy or amber. CTAs are black uppercase with letter-spacing.

**3-step quote request flow** — vehicle → contact → confirmation. State lives in React Context + sessionStorage, not URL params. Preserves state on accidental refresh without full page reloads between steps. A coordinator calls within 2 hours to confirm; no scheduling step in-app.

**229-vehicle catalog** — loaded from `lib/db/car_list_india.csv` (Make, Model, Category). Year is UI-only (static 2015–2024 dropdown); the DB stores make/model/category and assigns base prices by category tier. Vehicle picker shows 5 grid brand tiles (Maruti Suzuki, Hyundai, BMW, Honda, Toyota) with an inline "Other" dropdown for all remaining DB makes, plus a freeform fallback for anything not listed.

**560* PIN fallback** — instead of requiring every Bengaluru PIN to be seeded, the availability API automatically covers any `560xxx` PIN. Only add DB entries when a location-specific surcharge applies.

**Server Components by default** — only booking steps and header use `"use client"`. Landing page sections are pure server components for fast LCP.

**Fail-open rate limiting** — if Upstash is unavailable, the quote API still responds. Prevents Redis outages from blocking sales.

**Attribution at lead level** — UTM params and `fbclid` are captured on first page load and stored in sessionStorage, then written to every lead record. Connects Meta ad spend to actual bookings.

---

## Development Commands

```bash
pnpm dev          # Dev server at localhost:3000
pnpm build        # Production build
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit

pnpm db:generate  # Generate Drizzle migrations from schema
pnpm db:migrate   # Apply migrations to Neon
pnpm db:seed      # Seed vehicles, PIN codes, availability slots
```

See **[SETUP.md](./SETUP.md)** for full environment setup and deployment guide.

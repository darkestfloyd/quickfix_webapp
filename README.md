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
| `/api/leads` | Persists a completed booking + attribution + fires Meta CAPI event |
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
| Analytics | Meta Pixel (browser) + Conversions API (server) |
| Email | ZeptoMail (admin notifications on new leads) |
| Deploy | Vercel (region: `bom1` — Mumbai) |
| Package manager | pnpm |

---

## Meta Pixel + Conversions API (Ad Optimization)

The site runs a **redundant Pixel + CAPI setup** so Meta receives conversion signals from both browser and server. This is the recommended architecture for maximising Event Match Quality and ad optimization.

### How it works

1. **Meta Pixel** (`components/MetaPixel.tsx`) loads on every page via `app/layout.tsx`. The SDK automatically sets `_fbp` (browser ID) and `_fbc` (click ID, when user arrives from an ad) as first-party cookies.

2. **Browser events** (`lib/meta-events.ts`) fire via `fbq()`:
   - `PageView` — on every page load
   - `CTAClick` (custom) — when the hero CTA is clicked
   - `BookingStepComplete` (custom) — after each funnel step
   - `Lead` (standard) — on successful booking submission, with `eventID` for deduplication

3. **Server event** (`app/api/leads/route.ts`) fires a CAPI `Lead` event inside `after()` (keeps the Vercel serverless function alive after response). The CAPI payload includes:
   - `event_id` — matches the browser `eventID` for deduplication
   - `user_data.ph` — SHA-256 hashed phone
   - `user_data.em` — SHA-256 hashed email (when provided)
   - `user_data.fbc` — read from `_fbc` cookie (set by Meta Pixel SDK)
   - `user_data.fbp` — read from `_fbp` cookie (set by Meta Pixel SDK)
   - `user_data.client_ip_address` — from `x-forwarded-for` header (unhashed)
   - `user_data.client_user_agent` — from `user-agent` header (unhashed)

### Event deduplication

Browser and server both send a `Lead` event with the same `event_id` and `event_name`. Meta deduplicates within a 48-hour window — the conversion is counted once, but Meta merges matching parameters from both sources for richer signal.

### Why CAPI matters for ad-blocked users

When an ad blocker prevents the Meta Pixel from loading (~30-40% of traffic), no browser events fire and no `_fbp`/`_fbc` cookies are set. The CAPI event still fires with hashed phone, IP address, and user agent — giving Meta enough signal to attribute the conversion back to the ad click. Without CAPI, these conversions would be invisible to Meta's algorithm.

### Attribution flow

UTM parameters and `fbclid` are captured on first page load (`lib/attribution.ts`) → stored in `sessionStorage` → written to the `lead_requests` DB row at submission. The `fbclid` in the DB is for internal analytics; the CAPI integration reads `_fbc`/`_fbp` cookies directly from the request (Meta's recommended approach) rather than reconstructing them from the raw `fbclid`.

### Environment variables for Meta

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_META_PIXEL_ID` | Yes (for tracking) | Meta Pixel ID — used by browser-side `fbq()` |
| `META_PIXEL_ID` | Yes (for CAPI) | Same Pixel/Dataset ID — used server-side for CAPI endpoint |
| `META_CAPI_TOKEN` | Yes (for CAPI) | Conversions API access token from Meta Events Manager |

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
│   ├── booking/page.tsx        # 3-step booking funnel
│   ├── privacy/page.tsx        # Privacy Policy
│   ├── terms/page.tsx          # Terms of Service
│   └── api/
│       ├── quote/route.ts      # GET vehicle list | POST price lookup
│       ├── availability/route.ts  # GET open slots by PIN (560* fallback)
│       ├── leads/route.ts      # POST lead submission + CAPI event + admin email
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
│   └── MetaPixel.tsx           # Pixel SDK loader + PageView trigger
│
├── lib/
│   ├── utils.ts            # cn(), formatINR(), generateSessionId()
│   ├── attribution.ts      # UTM / fbclid capture → sessionStorage
│   ├── meta-events.ts      # fbq() wrappers (trackCTAClick, trackLeadSubmit, trackStepComplete)
│   ├── email.ts            # ZeptoMail client — admin notification on new leads
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

**3-step quote request flow** — vehicle → contact → confirmation. State lives in React Context + sessionStorage, not URL params. Preserves state on accidental refresh without full page reloads between steps. A coordinator calls within 24 hours to confirm; no scheduling step in-app.

**229-vehicle catalog** — loaded from `lib/db/car_list_india.csv` (Make, Model, Category). Year is UI-only (static 2015–2024 dropdown); the DB stores make/model/category and assigns base prices by category tier. Vehicle picker shows 5 grid brand tiles (Maruti Suzuki, Hyundai, BMW, Honda, Toyota) with an inline "Other" dropdown for all remaining DB makes, plus a freeform fallback for anything not listed.

**560* PIN fallback** — instead of requiring every Bengaluru PIN to be seeded, the availability API automatically covers any `560xxx` PIN. Only add DB entries when a location-specific surcharge applies.

**Server Components by default** — only booking steps and header use `"use client"`. Landing page sections are pure server components for fast LCP.

**Fail-open rate limiting** — if Upstash is unavailable, the quote API still responds. Prevents Redis outages from blocking sales.

**Redundant Pixel + CAPI** — every Lead event fires from both browser (pixel) and server (CAPI) with matching `event_id` for deduplication. CAPI reads `_fbc`/`_fbp` cookies from the request plus IP and user agent. This maximises Event Match Quality and ensures conversions are attributed even when ad blockers prevent the pixel from loading.

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

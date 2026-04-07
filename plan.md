# QuickFix Windshields — Product & Technical Specification

## Summary

Lead generation website for a premium mobile windshield repair and replacement service in Bengaluru. The funnel drives users from a marketing landing page to a 3-step quote request flow. A coordinator calls within 2 hours to confirm and schedule. No in-app scheduling — appointment booking happens over the phone.

**Target audience**: High-income car owners in Bengaluru who want a hassle-free, doorstep service.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 (azure_concierge theme) |
| UI | shadcn/ui (manually written, no CLI) |
| Forms | React Hook Form + Zod |
| Database | Neon Postgres via Drizzle ORM |
| Rate limiting | Upstash Redis (`@upstash/ratelimit`, fail-open) |
| Analytics | Meta Pixel (client) + server-side Conversions API |
| Deploy | Vercel, region `bom1` (Mumbai) |
| Package manager | pnpm |

---

## Funnel — 3 Steps

### Step 1: Vehicle
- 5 primary brand tiles: Maruti Suzuki, Hyundai, BMW, Honda, Toyota
- Inline "Other" dropdown (6th grid cell): all remaining DB makes alphabetically + "Other (not listed)" option
- Selecting "Other (not listed)" reveals freeform Make + Model text inputs
- Model dropdown (filtered by selected make from DB)
- Year dropdown (static 2015–2024, UI-only — not stored in vehicle catalog)
- Glass type: Front Windshield (enabled) | Rear/Door Glass (disabled, coming soon)

### Step 2: Contact
- Name, phone (10-digit Indian mobile, 6–9 prefix), email (optional)
- Desktop: form + booking summary side-by-side

### Step 3: Confirmation
- Auto-submits lead on mount
- Shows reference ID, expected callback window (2 hrs), technician arrival info
- Payment info: UPI / Card / Cash at service
- WhatsApp and phone CTA for immediate contact

---

## Data Model

### `vehicle_pricing`
| Column | Type | Notes |
|---|---|---|
| id | serial PK | |
| make | varchar(100) | |
| model | varchar(100) | |
| vehicle_category | varchar(100) | nullable; from CSV |
| base_price | numeric(10,2) | pre-markup |
| current_price | numeric(10,2) | base_price × 1.15 |

Unique on `(make, model)`. Year is not stored — it is captured as a UI field and written to `lead_requests` only.

### `pricing_markup`
Global markup rules. Currently: 15% on all vehicles. Change value in DB to globally adjust prices (no redeploy needed).

### `service_pin_coverage`
Stores PIN-specific surcharges. Any `560xxx` PIN not in this table is automatically covered as Bengaluru with ₹0 surcharge (API fallback).

### `availability_slots`
Mon–Sat, 3 fixed windows/day (09:00–12:00, 12:00–14:00, 14:00–17:00), seeded for next 30 days. Not currently shown in-funnel — scheduling happens by phone.

### `lead_requests`
One row per submitted booking. Captures vehicle details (year/make/model), quote amount, customer info, attribution (UTM, fbclid, referrer, sessionId), and status.

### `lead_events`
Server-side funnel event log: `step_complete`, `lead_submit`, etc. Keyed by sessionId.

---

## Vehicle Catalog

- **Source**: `lib/db/car_list_india.csv` — 229 vehicles, 3 columns: Make, Model, Vehicle Category
- **Seeding**: `pnpm db:seed` parses the CSV and assigns base prices by category keyword
- **Pricing tiers**:

| Category keywords | Base price (INR) |
|---|---|
| Hatchback / Compact | ₹3,800 |
| Sedan / SUV / MPV / Crossover (unqualified) | ₹5,500 |
| Premium Sedan/SUV / Electric | ₹8,500 |
| Performance SUV | ₹10,000 |
| Luxury / Grand Tourer | ₹12,000 |
| Ultra-Luxury / Supercar | ₹18,000 |

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/quote` | GET | Full vehicle list with prices (cached 1 hr). Used by VehicleStep on mount. |
| `/api/quote` | POST | Price lookup by make+model (rate-limited: 5 req/IP/60s, fail-open). |
| `/api/availability` | GET | Open slots by PIN code (560* fallback for Bengaluru). |
| `/api/leads` | POST | Persist lead + fire Meta Conversions API event. |
| `/api/track` | POST | Server-side funnel event logging. |

---

## Attribution

- UTM params (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`) and `fbclid` captured on first page load → stored in `sessionStorage`
- Written to every `lead_requests` row at submission
- Server-side Meta Conversions API fires on lead submit (hashed phone + email)

---

## Service Coverage

Bengaluru only. Availability API accepts any `560xxx` PIN without a DB entry. Add rows to `service_pin_coverage` only when a surcharge applies for a specific area.

---

## Design System (azure_concierge)

- **Palette**: Black (#000) CTAs, white/stone backgrounds, teal (#00C9A7) for success/guarantee
- **Typography**: Playfair Display (headings, italic emphasis on key word), Inter (body)
- **CTAs**: Black uppercase with letter-spacing (`"GET FREE QUOTE →"`)
- **Heading pattern**: `"Effortless` *`Restoration`*`"` — main word + italic emphasis
- **Mobile-first**: all layouts designed for phone; desktop adds split views

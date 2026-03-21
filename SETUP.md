# Setup Guide

---

## Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- A [Neon](https://neon.tech) Postgres project (free tier works)
- (Optional) An [Upstash](https://upstash.com) Redis database for rate limiting

---

## Local Development

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

```env
# Required — get from https://console.neon.tech > your project > Connection string
DATABASE_URL=postgres://user:password@ep-xxx.region.aws.neon.tech/quickfix?sslmode=require

# Optional — get from https://console.upstash.com > your Redis DB > REST API
# If missing, rate limiting fails open (all requests pass through)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# Meta Pixel — swap placeholder before launch
NEXT_PUBLIC_META_PIXEL_ID=PLACEHOLDER_PIXEL_ID

# App base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Business contact (shown in footer and confirmation page)
NEXT_PUBLIC_BUSINESS_PHONE=+91 98765 43210
NEXT_PUBLIC_BUSINESS_WHATSAPP=919876543210
```

### 3. Set up the database

```bash
# Generate SQL migration files from schema.ts
pnpm db:generate

# Apply migrations to your Neon database
pnpm db:migrate

# Seed with vehicles, PIN codes, and 30 days of availability slots
pnpm db:seed
```

### 4. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The booking funnel at `/booking` is fully functional once the DB is seeded.

---

## Database Management

### Schema changes

Edit `lib/db/schema.ts`, then:

```bash
pnpm db:generate   # creates a new file in drizzle/
pnpm db:migrate    # applies it to Neon
```

Migration files in `drizzle/` are committed to git.

### Inspecting data

The fastest way to inspect or edit data is via the **Neon SQL Editor** at console.neon.tech. Useful queries:

```sql
-- Check seeded vehicles
SELECT make, model, current_price FROM vehicle_pricing ORDER BY make;

-- Check PIN coverage
SELECT pin_code, city, is_active FROM service_pin_coverage;

-- View latest leads
SELECT id, vehicle_make, vehicle_model, customer_phone, status, created_at
FROM lead_requests ORDER BY created_at DESC LIMIT 20;

-- Check slot availability for a date
SELECT slot_date, slot_time, max_bookings, booked_count
FROM availability_slots WHERE slot_date = '2026-04-01';
```

### Re-seeding

The seed script uses `onConflictDoNothing()` so it's safe to re-run:

```bash
pnpm db:seed
```

To extend slot coverage beyond 30 days, edit the loop in `lib/db/seed.ts`:

```ts
for (let d = 1; d <= 30; d++) {  // change 30 to however many days you want
```

---

## Adding / Modifying Vehicles

Edit the `VEHICLES` array in `lib/db/seed.ts`:

```ts
{ year: 2024, make: "Kia", model: "Seltos", basePrice: 6000 },
```

Then re-run `pnpm db:seed`. To add a model without re-seeding, insert directly via Neon SQL Editor:

```sql
INSERT INTO vehicle_pricing (year, make, model, base_price, current_price)
VALUES (2024, 'Kia', 'Seltos', 6000, 6900);
```

---

## Adding / Modifying Service Areas (PIN codes)

Edit the `PIN_CODES` array in `lib/db/seed.ts` and re-run `pnpm db:seed`, or insert directly:

```sql
INSERT INTO service_pin_coverage (pin_code, city, state, is_active, surcharge)
VALUES ('500082', 'Hyderabad', 'Telangana', true, 0);
```

---

## Experiments & Feature Flags

The codebase has no feature flag system yet. The recommended pattern for rapid experiments is environment variables:

### A/B test a new headline

1. Add to `.env.local` and `.env.example`:
   ```env
   NEXT_PUBLIC_HERO_HEADLINE=Your Windshield Fixed While You Work
   ```
2. In `components/sections/Hero.tsx`:
   ```tsx
   const headline = process.env.NEXT_PUBLIC_HERO_HEADLINE
     ?? "Your Windshield Replaced at Your Doorstep";
   ```
3. Deploy variant to a Vercel preview branch with the new env var set.

### Test a new pricing tier

Edit `pricing_markup` in the DB via Neon SQL Editor:

```sql
UPDATE pricing_markup SET value = 20 WHERE is_active = true;
```

No redeploy needed — prices are fetched live from DB.

### Adding a new booking step

1. Create `components/booking/steps/NewStep.tsx`
2. Add its data fields to `BookingState` in `types/index.ts`
3. Add an action to the `Action` union and handle it in `reducer` in `BookingStore.tsx`
4. Add the step to the `STEPS` array in `BookingForm.tsx` and render it
5. Add a `SET_STEP` dispatch call at the right point in the previous step

### Tracking a new funnel event

Fire it client-side from any booking step:

```ts
fetch("/api/track", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sessionId,
    eventType: "my_custom_event",
    step: 2,
    metadata: { someKey: "someValue" },
  }),
});
```

Events land in the `lead_events` table and can be queried in Neon.

---

## Production Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "initial commit"
git push origin main
```

### 2. Import project in Vercel

- Go to [vercel.com/new](https://vercel.com/new) → Import your repo
- Framework preset: **Next.js** (auto-detected)

### 3. Set environment variables in Vercel

Under **Settings → Environment Variables**, add everything from `.env.example`:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon connection string |
| `UPSTASH_REDIS_REST_URL` | Upstash REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash token |
| `NEXT_PUBLIC_META_PIXEL_ID` | Real Pixel ID |
| `NEXT_PUBLIC_BASE_URL` | `https://yourdomain.com` |
| `NEXT_PUBLIC_BUSINESS_PHONE` | `+91 XXXXX XXXXX` |
| `NEXT_PUBLIC_BUSINESS_WHATSAPP` | `91XXXXXXXXXX` |

### 4. Deploy

Vercel deploys automatically on every push to `main`. The `vercel.json` pins the serverless region to `bom1` (Mumbai) for low latency.

### 5. Connect custom domain

In Vercel → **Domains**, add your domain and follow DNS instructions.

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon Postgres connection string |
| `UPSTASH_REDIS_REST_URL` | No | Rate limiting (fails open if missing) |
| `UPSTASH_REDIS_REST_TOKEN` | No | Rate limiting (fails open if missing) |
| `NEXT_PUBLIC_META_PIXEL_ID` | No | Meta Pixel ID — use `PLACEHOLDER_PIXEL_ID` until ready |
| `NEXT_PUBLIC_BASE_URL` | No | Used in Schema.org JSON-LD |
| `NEXT_PUBLIC_BUSINESS_PHONE` | No | Shown in header, footer, confirmation page |
| `NEXT_PUBLIC_BUSINESS_WHATSAPP` | No | WhatsApp deep link on confirmation page |

---

## Common Issues

**`DATABASE_URL not set` error on boot**
→ `.env.local` is missing or `DATABASE_URL` is blank. The DB client throws immediately on first request.

**Quote returns 404 for a vehicle**
→ The vehicle isn't in `vehicle_pricing`. Add it via seed or direct SQL insert (see above).

**PIN code shows "outside coverage"**
→ The PIN isn't in `service_pin_coverage`. Add it via seed or direct SQL insert.

**No slots available for a date**
→ Either the slots weren't seeded, or `booked_count >= max_bookings`. Run `pnpm db:seed` or insert new slots directly. For a quick fix: `UPDATE availability_slots SET booked_count = 0;`

**Rate limit blocking quote requests in dev**
→ Upstash Redis isn't configured (or is shared with prod). Either add a separate dev Upstash DB in `.env.local`, or temporarily remove `UPSTASH_REDIS_REST_URL` — rate limiting fails open and all requests pass through.

# QuickFix Mobile-First Scheduling App Plan

## Summary
Build a mobile-first Next.js App Router web app on Vercel with Neon Postgres. The product is a premium, lead-generation focused scheduling flow for mobile windshield replacement. The funnel drives users from a luxury landing page to a quote, then to scheduling, contact capture, and confirmation. Traffic is expected to be 90%+ mobile, so all UX, performance, and form ergonomics are designed for phones first.

## Stack And Bootstrapping
- Node.js 22+ required (local and CI).
- Package manager: `pnpm`.
- Bootstrap with `pnpm create next-app@latest` (App Router, TypeScript, ESLint).
- Use Tailwind CSS and shadcn/ui for the UI.
- Use React Hook Form + Zod for the multi-step form.
- Deploy on Vercel.
- Database: Neon Postgres.

## Scope And UX
- Landing page optimized for lead capture:
  premium positioning, trust signals, short copy, and a dominant `Get Free Quote` CTA.
- Funnel steps:
  1) Vehicle make/model/year selection.
  2) Location ZIP and appointment time (live availability).
  3) Contact info.
  4) Confirmation with summary, contact methods, and payment info.
- Provide quick quote after vehicle selection using pricing data from Neon plus markup.
- Rate limit quote lookups to reduce abuse.
- Handle unsupported vehicles and out-of-coverage ZIPs gracefully without dead ends.
- Mobile-first UX:
  large tap targets, sticky CTA, autofill-friendly inputs, numeric keyboards for ZIP/phone.

## Data Model (Neon)
- `vehicle_pricing`: year/make/model/base_price/current_price.
- `pricing_markup`: markup rules used to compute the displayed quote.
- `service_zip_coverage`: supported ZIP codes and optional surcharge fields.
- `availability_slots`: available appointment slots (externally maintained).
- `lead_requests`: canonical lead record with vehicle details, quote snapshot, scheduling data, contact info, attribution, and status.
- `lead_events` (optional): step completion and interaction events.

## API Routes
- `POST /api/quote`: lookup vehicle pricing + markup, return quick quote (rate-limited).
- `GET /api/availability`: return available slots for a ZIP or region.
- `POST /api/leads`: validate and store final submission.
- `POST /api/track`: optional server-side event collection for attribution.

## Marketing And Attribution
- Meta-only launch (Instagram/Facebook ads).
- Capture `utm_*`, `fbclid`, referrer, landing page, session id.
- Fire tracking events:
  page view, CTA click, quote view, step progress, lead submit, confirmation view.
- Store attribution alongside the lead record.

## Admin/Ops Scope
- No in-app admin in v1.
- Pricing, ZIP coverage, and availability maintained outside the app and loaded into Neon.

## Test Plan
- Mobile UX: fast load, above-the-fold CTA, no horizontal scroll, thumb-friendly inputs.
- Quote lookup: correct pricing + markup, handles missing data, rate limit enforced.
- ZIP coverage: supported ZIPs proceed, unsupported ZIPs provide manual review path.
- Availability: returns valid future slots, handles empty availability safely.
- Lead submission: persisted with quote snapshot and attribution.
- Meta event tracking fires correctly across the funnel.

## Risks And Mitigations
- Pricing data quality: validate required fields and provide fallback messaging.
- Availability data latency: cache at the edge with short TTL to keep UX fast.
- Mobile drop-off: keep steps short, reduce typing, and preserve progress between steps.

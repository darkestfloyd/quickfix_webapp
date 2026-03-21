# QuickFix - Remote Windshield Service Website

## Project Overview
Business website for a mobile/remote windshield repair and replacement service. Customers can learn about services, check service areas, get quotes, and book appointments online.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **Package Manager**: npm

## Project Structure
```
quickfix/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with nav/footer
│   ├── page.tsx            # Home page
│   ├── services/           # Services page
│   ├── booking/            # Online booking form
│   ├── about/              # About page
│   └── contact/            # Contact page
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Header, Footer, Nav
│   └── sections/           # Page sections (Hero, Services, etc.)
├── lib/                    # Utilities and helpers
├── public/                 # Static assets (images, icons)
└── types/                  # TypeScript type definitions
```

## Key Pages & Features
- **Home**: Hero with CTA, service highlights, trust signals, testimonials
- **Services**: Chip repair, crack repair, full replacement, ADAS recalibration
- **Booking**: Multi-step form (vehicle info, service type, location, date/time)
- **Service Area**: Coverage map / zip code checker
- **About**: Company story, technicians, certifications
- **Contact**: Phone, email, contact form

## Business Details (placeholders — update with real info)
- Business name: QuickFix Auto Glass
- Service types: Chip repair, crack repair, windshield replacement, ADAS recalibration
- Mobile service: technician comes to customer's location (home, office, parking lot)
- Coverage: define service area by city/zip codes

## Development Commands
```bash
npm run dev       # Start dev server at localhost:3000
npm run build     # Production build
npm run lint      # Run ESLint
npm run typecheck # Run tsc --noEmit
```

## Conventions
- Use TypeScript strictly — no `any` types
- Tailwind for all styling — no CSS modules or styled-components
- Server Components by default; only use `"use client"` when needed (forms, interactivity)
- Keep components focused and small; compose sections from smaller pieces
- Images: use `next/image` for all images
- Links: use `next/link` for internal navigation

## SEO
- Each page must have metadata (title, description) via Next.js `generateMetadata`
- Semantic HTML: use proper heading hierarchy (h1 > h2 > h3)
- Schema.org structured data for LocalBusiness on home page

## Design Direction
- Professional, trustworthy, approachable
- Color palette: deep blue primary, white/light gray backgrounds, amber accent for CTAs
- Mobile-first responsive design
- Clear CTAs: "Book Now" and "Get a Free Quote" prominently placed

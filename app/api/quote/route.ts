/**
 * /api/quote
 *
 * GET  — returns full vehicle list including prices (used by VehicleStep)
 *         Response: { vehicles: VehicleOption[], grouped: Record<make, {year,model}[]> }
 *         Cached: public, max-age=3600 — vehicle list is seeded/static data.
 *         currentPrice is included so the client can show quotes with NO extra POST call.
 *
 * POST — returns INR price for a specific vehicle (rate-limited: 5 req/IP/60s)
 *         Body:     { year: number, make: string, model: string }
 *         Response: { quote: number, currency: "INR", label: string, breakdown: {...} }
 *         Errors:   404 vehicle not found | 429 rate limit exceeded
 *
 * To disable rate limiting in dev: remove UPSTASH_REDIS_REST_URL from .env.local
 * (rate limiter fails open — all requests pass through)
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { vehiclePricing, pricingMarkup } from "@/lib/db/schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { eq, and } from "drizzle-orm";

const quoteSchema = z.object({
  year: z.number().int().min(2000).max(2030).optional(),
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
});

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "anonymous"
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { success, remaining } = await checkRateLimit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      {
        status: 429,
        headers: { "X-RateLimit-Remaining": String(remaining) },
      }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid vehicle data", details: parsed.error.flatten() }, { status: 400 });
  }

  const { make, model } = parsed.data;

  const [vehicle] = await db
    .select()
    .from(vehiclePricing)
    .where(
      and(
        eq(vehiclePricing.make, make),
        eq(vehiclePricing.model, model)
      )
    )
    .limit(1);

  if (!vehicle) {
    return NextResponse.json(
      { error: "Vehicle not found in our pricing database. We will contact you with a custom quote." },
      { status: 404 }
    );
  }

  const basePrice = parseFloat(vehicle.basePrice);
  const currentPrice = parseFloat(vehicle.currentPrice);
  const markup = currentPrice - basePrice;

  return NextResponse.json({
    quote: currentPrice,
    currency: "INR",
    label: `₹${currentPrice.toLocaleString("en-IN")}`,
    breakdown: {
      basePrice,
      markup,
      total: currentPrice,
    },
  });
}

// GET — vehicle list with prices embedded so the client can show quotes instantly
export async function GET() {
  const vehicles = await db
    .select({
      make: vehiclePricing.make,
      model: vehiclePricing.model,
      currentPrice: vehiclePricing.currentPrice,
    })
    .from(vehiclePricing)
    .orderBy(vehiclePricing.make, vehiclePricing.model);

  const grouped: Record<string, string[]> = {};
  for (const v of vehicles) {
    if (!grouped[v.make]) grouped[v.make] = [];
    grouped[v.make].push(v.model);
  }

  return NextResponse.json(
    { vehicles, grouped },
    { headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } }
  );
}

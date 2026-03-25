/**
 * /api/availability  GET
 *
 * Query param: ?pin=XXXXXX (6-digit PIN code)
 *
 * Coverage logic (in order):
 *   1. Exact match in service_pin_coverage table → use stored city + surcharge
 *   2. PIN starts with "560" (not in table) → Bengaluru fallback, surcharge ₹0
 *   3. Otherwise → covered: false
 *
 * Currently serving: Bengaluru only (all 560xxx PINs).
 * To expand to a new city, add explicit DB entries AND extend the fallback
 * logic below.
 *
 * Response (covered):
 *   { covered: true, city, state, surcharge, slots: AvailabilitySlot[] }
 * Response (uncovered):
 *   { covered: false, city: null, slots: [], message: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { availabilitySlots, servicePinCoverage } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { istTomorrow, nextISTWeekdays } from "@/lib/utils";

function formatTimeLabel(time: string, endTime: string): string {
  const fmt = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
  };
  return `${fmt(time)} – ${fmt(endTime)}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const pin = searchParams.get("pin");

  if (!pin || !/^\d{6}$/.test(pin)) {
    return NextResponse.json({ error: "Valid 6-digit PIN code required" }, { status: 400 });
  }

  // Check PIN coverage
  const [coverage] = await db
    .select()
    .from(servicePinCoverage)
    .where(and(eq(servicePinCoverage.pinCode, pin), eq(servicePinCoverage.isActive, true)))
    .limit(1);

  // Fall back to Bengaluru-wide coverage for any 560xxx PIN not in the DB
  const blrFallback = !coverage && pin.startsWith("560");
  if (!coverage && !blrFallback) {
    return NextResponse.json({
      covered: false,
      city: null,
      slots: [],
      message: "We are currently serving Bengaluru only. We'll be expanding soon.",
    });
  }

  const city = coverage?.city ?? "Bengaluru";
  const state = coverage?.state ?? "Karnataka";
  const surcharge = coverage ? parseFloat(coverage.surcharge) : 0;

  // Show next 4 weekdays (Mon–Sat) starting from tomorrow in IST — no same-day bookings
  const tomorrowStr = istTomorrow();
  const activeDates = nextISTWeekdays(tomorrowStr, 4);
  const lastDateStr = activeDates[activeDates.length - 1];

  // Return ALL slots for the window (booked + available) so UI can grey out booked ones
  const slots = await db
    .select()
    .from(availabilitySlots)
    .where(
      and(
        gte(availabilitySlots.slotDate, tomorrowStr),
        lte(availabilitySlots.slotDate, lastDateStr)
      )
    )
    .orderBy(availabilitySlots.slotDate, availabilitySlots.slotTime);

  // Only include slots from the 4 active dates (excludes any Sundays in the range)
  const activeDateSet = new Set(activeDates);
  const formattedSlots = slots
    .filter((s) => activeDateSet.has(s.slotDate))
    .map((s) => ({
      id: s.id,
      date: s.slotDate,
      time: s.slotTime,
      endTime: s.slotEndTime,
      label: formatTimeLabel(s.slotTime, s.slotEndTime),
      available: s.bookedCount < s.maxBookings,
    }));

  return NextResponse.json({
    covered: true,
    city,
    state,
    surcharge,
    slots: formattedSlots,
  });
}

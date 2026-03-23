import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { availabilitySlots, servicePinCoverage } from "@/lib/db/schema";
import { eq, and, gte, lte, lt, sql } from "drizzle-orm";

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

  // Return slots for next 7 days with availability
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 7);
  const futureDateStr = futureDate.toISOString().split("T")[0];

  const slots = await db
    .select()
    .from(availabilitySlots)
    .where(
      and(
        gte(availabilitySlots.slotDate, todayStr),
        lte(availabilitySlots.slotDate, futureDateStr),
        lt(availabilitySlots.bookedCount, availabilitySlots.maxBookings)
      )
    )
    .orderBy(availabilitySlots.slotDate, availabilitySlots.slotTime);

  const formattedSlots = slots.map((s) => ({
    id: s.id,
    date: s.slotDate,
    time: s.slotTime,
    endTime: s.slotEndTime,
    label: formatTimeLabel(s.slotTime, s.slotEndTime),
  }));

  return NextResponse.json({
    covered: true,
    city,
    state,
    surcharge,
    slots: formattedSlots,
  });
}

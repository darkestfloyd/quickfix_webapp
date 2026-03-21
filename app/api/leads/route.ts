/**
 * /api/leads  POST
 *
 * Persists a completed booking to the lead_requests table and increments
 * the booked_count on the selected availability slot.
 *
 * Called automatically from ConfirmationStep on mount (step 4).
 * Includes UTM / fbclid attribution from sessionStorage.
 *
 * Body: LeadRequest (see types/index.ts)
 * Response: { success: true, referenceId: string (UUID) }
 *
 * To view submitted leads:
 *   SELECT * FROM lead_requests ORDER BY created_at DESC LIMIT 20;
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { leadRequests, availabilitySlots } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

const leadSchema = z.object({
  vehicleYear: z.number().int().min(2000).max(2030),
  vehicleMake: z.string().min(1).max(100),
  vehicleModel: z.string().min(1).max(100),
  quoteAmount: z.number().positive(),
  servicePin: z.string().regex(/^\d{6}$/),
  serviceCity: z.string().min(1).max(100),
  serviceAddress: z.string().min(5).max(500),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}/),
  slotId: z.number().int().positive().optional(),
  customerName: z.string().min(2).max(200),
  customerPhone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  // Attribution (all optional)
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(200).optional(),
  utmContent: z.string().max(200).optional(),
  fbclid: z.string().max(255).optional(),
  referrer: z.string().max(1000).optional(),
  sessionId: z.string().max(64).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Insert lead (and optionally increment slot booking count in parallel)
  const [lead] = await db
    .insert(leadRequests)
    .values({
      vehicleYear: data.vehicleYear,
      vehicleMake: data.vehicleMake,
      vehicleModel: data.vehicleModel,
      quoteAmount: String(data.quoteAmount),
      servicePin: data.servicePin,
      serviceCity: data.serviceCity,
      serviceAddress: data.serviceAddress,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      slotId: data.slotId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || null,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      utmContent: data.utmContent,
      fbclid: data.fbclid,
      referrer: data.referrer,
      sessionId: data.sessionId,
      status: "pending",
    })
    .returning({ id: leadRequests.id });

  // Increment booked count for the slot (best-effort)
  if (data.slotId) {
    await db
      .update(availabilitySlots)
      .set({ bookedCount: sql`${availabilitySlots.bookedCount} + 1` })
      .where(eq(availabilitySlots.id, data.slotId))
      .catch(() => {
        // Non-fatal: slot count increment failure doesn't block lead creation
      });
  }

  return NextResponse.json({ success: true, referenceId: lead.id }, { status: 201 });
}

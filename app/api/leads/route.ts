/**
 * /api/leads  POST
 *
 * Persists a quote request to the lead_requests table.
 *
 * Called automatically from ConfirmationStep on mount (step 3).
 * Includes UTM / fbclid attribution from sessionStorage.
 *
 * Body: LeadRequest (see types/index.ts)
 * Response: { success: true, referenceId: string (UUID) }
 *
 * To view submitted leads:
 *   SELECT * FROM lead_requests ORDER BY created_at DESC LIMIT 20;
 */
import { createHash } from "crypto";
import { after } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { leadRequests } from "@/lib/db/schema";
import { sendLeadNotification } from "@/lib/email";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

const leadSchema = z.object({
  vehicleYear: z.number().int().min(2000).max(2030),
  vehicleMake: z.string().min(1).max(100),
  vehicleModel: z.string().min(1).max(100),
  quoteAmount: z.number().positive().optional(),
  servicePin: z.string().regex(/^\d{6}$/).optional(),
  serviceCity: z.string().max(100).optional(),
  serviceAddress: z.string().min(5).max(500).optional(),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}/).optional(),
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
  eventId: z.string().max(64).optional(),
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
      quoteAmount: data.quoteAmount ? String(data.quoteAmount) : null,
      servicePin: data.servicePin ?? null,
      serviceCity: data.serviceCity ?? null,
      serviceAddress: data.serviceAddress ?? null,
      appointmentDate: data.appointmentDate ?? null,
      appointmentTime: data.appointmentTime ?? null,
      slotId: data.slotId ?? null,
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

  // Background work — runs after the response is sent, keeps the serverless function alive on Vercel
  after(async () => {
    // Email notification to admin
    await sendLeadNotification({
      referenceId: lead.id,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      vehicleYear: data.vehicleYear,
      vehicleMake: data.vehicleMake,
      vehicleModel: data.vehicleModel,
      quoteAmount: data.quoteAmount ? String(data.quoteAmount) : null,
      servicePin: data.servicePin,
      serviceCity: data.serviceCity,
      serviceAddress: data.serviceAddress,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
    }).catch(() => {}); // Non-fatal — DB insert already succeeded

    // Conversions API — server-side event for improved match quality
    const capiPixelId = process.env.META_PIXEL_ID;
    const capiToken = process.env.META_CAPI_TOKEN;
    if (capiPixelId && capiToken) {
      const userData: Record<string, unknown> = {
        ph: [sha256(data.customerPhone)],
      };
      if (data.customerEmail) {
        userData.em = [sha256(data.customerEmail)];
      }
      if (data.fbclid) {
        userData.fbc = `fb.1.${Date.now()}.${data.fbclid}`;
      }
      await fetch(
        `https://graph.facebook.com/v19.0/${capiPixelId}/events?access_token=${capiToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: [{
              event_name: "Lead",
              event_time: Math.floor(Date.now() / 1000),
              event_id: data.eventId ?? lead.id,
              action_source: "website",
              event_source_url: "https://www.quickfixwindshields.co/booking",
              user_data: userData,
              custom_data: {
                currency: "INR",
                value: data.quoteAmount ?? 0,
              },
            }],
          }),
        }
      ).catch(() => {});
    }
  });

  return NextResponse.json({ success: true, referenceId: lead.id }, { status: 201 });
}

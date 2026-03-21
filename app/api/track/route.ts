import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { leadEvents } from "@/lib/db/schema";

const trackSchema = z.object({
  sessionId: z.string().min(1).max(64),
  eventType: z.string().min(1).max(100),
  step: z.number().int().min(1).max(4).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = trackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid event data" }, { status: 400 });
  }

  const { sessionId, eventType, step, metadata } = parsed.data;

  await db.insert(leadEvents).values({ sessionId, eventType, step, metadata });

  return NextResponse.json({ success: true });
}

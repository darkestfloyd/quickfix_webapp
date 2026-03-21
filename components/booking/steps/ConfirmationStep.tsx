"use client";

import { useEffect, useState } from "react";
import { useBooking } from "../BookingStore";
import { trackLeadSubmit, trackStepComplete } from "@/lib/meta-events";
import { getStoredAttribution } from "@/lib/attribution";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Phone, MessageCircle, Car, MapPin, Calendar, Clock } from "lucide-react";
import Link from "next/link";

const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 98765 43210";
const WHATSAPP = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "919876543210";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatTime(timeStr?: string): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function ConfirmationStep() {
  const { state, sessionId, dispatch } = useBooking();
  const [submitting, setSubmitting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  useEffect(() => {
    const attribution = getStoredAttribution();

    const payload = {
      vehicleYear: state.vehicleYear,
      vehicleMake: state.vehicleMake,
      vehicleModel: state.vehicleModel,
      quoteAmount: state.quoteAmount,
      servicePin: state.servicePin,
      serviceCity: state.serviceCity ?? "",
      serviceAddress: state.serviceAddress,
      appointmentDate: state.appointmentDate,
      appointmentTime: state.appointmentTime,
      slotId: state.slotId,
      customerName: state.customerName,
      customerPhone: state.customerPhone,
      customerEmail: state.customerEmail,
      sessionId,
      ...attribution,
    };

    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data: { success?: boolean; referenceId?: string; error?: string }) => {
        if (data.success && data.referenceId) {
          setReferenceId(data.referenceId);
          dispatch({ type: "SET_REFERENCE", referenceId: data.referenceId });
          trackLeadSubmit(state.quoteAmount ?? 0);
          trackStepComplete(4, "Confirmation");
          fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, eventType: "lead_submit", step: 4, metadata: { referenceId: data.referenceId } }),
          }).catch(() => {});
        } else {
          setError(data.error ?? "Submission failed. Please try again.");
        }
      })
      .catch(() => setError("Network error. Please check your connection and try again."))
      .finally(() => setSubmitting(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (submitting) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
        <p className="font-medium text-navy-900">Confirming your booking request...</p>
        <p className="text-sm text-muted-foreground">This will just take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 py-8 text-center">
        <p className="font-semibold text-destructive">Something went wrong</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="amber" onClick={() => { setError(null); setSubmitting(true); }}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success header */}
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-500" />
        <h2 className="text-xl font-bold text-green-900">Booking Request Received!</h2>
        <p className="mt-1 text-sm text-green-700">
          We'll call you within 2 hours to confirm your appointment.
        </p>
        {referenceId && (
          <Badge variant="success" className="mt-3">
            Ref: #{referenceId.slice(0, 8).toUpperCase()}
          </Badge>
        )}
      </div>

      {/* Booking summary */}
      <div className="rounded-xl border bg-white p-5 space-y-4">
        <h3 className="font-semibold text-navy-900">Booking Summary</h3>
        <Separator />

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Car className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div>
              <p className="font-medium">{state.vehicleMake} {state.vehicleModel} ({state.vehicleYear})</p>
              <p className="text-muted-foreground">Estimated: {formatINR(state.quoteAmount ?? 0)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div>
              <p className="font-medium">{state.serviceAddress}</p>
              <p className="text-muted-foreground">PIN: {state.servicePin} — {state.serviceCity}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="font-medium">{formatDate(state.appointmentDate)}</p>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="font-medium">{formatTime(state.appointmentTime)} (2-hour window)</p>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="rounded-xl border bg-white p-5 space-y-3">
        <h3 className="font-semibold text-navy-900">Payment Methods</h3>
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">UPI</Badge>
            <span className="text-muted-foreground">Google Pay, PhonePe, Paytm, BHIM — collected on-site</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Card</Badge>
            <span className="text-muted-foreground">Credit / Debit card via mobile POS</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Cash</Badge>
            <span className="text-muted-foreground">Cash accepted at time of service</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Payment is collected after service is complete. No advance required.</p>
      </div>

      {/* Contact */}
      <div className="rounded-xl border bg-white p-5 space-y-3">
        <h3 className="font-semibold text-navy-900">Questions? Contact Us</h3>
        <Separator />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call Us
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1">
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hi, I just booked a windshield service (Ref: ${referenceId?.slice(0, 8).toUpperCase()}). Need help.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>

      <Button asChild variant="ghost" size="sm" className="w-full text-muted-foreground">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}

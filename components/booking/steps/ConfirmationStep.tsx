"use client";

import { useEffect, useState } from "react";
import { useBooking } from "../BookingStore";
import { trackLeadSubmit, trackStepComplete } from "@/lib/meta-events";
import { getStoredAttribution } from "@/lib/attribution";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Phone, MessageCircle, MapPin, Check } from "lucide-react";
import Link from "next/link";

const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 98765 43210";
const WHATSAPP = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "919876543210";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatTime(timeStr?: string) {
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
      serviceCity: state.serviceCity,
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
          setError(data.error ?? "Submission failed.");
        }
      })
      .catch(() => setError("Network error. Please check your connection."))
      .finally(() => setSubmitting(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (submitting) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <p className="font-semibold text-black">Confirming your booking request...</p>
        <p className="text-sm text-gray-400">This will just take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 py-12 text-center">
        <p className="font-semibold text-black">Something went wrong</p>
        <p className="text-sm text-gray-500">{error}</p>
        <Button variant="black" onClick={() => { setError(null); setSubmitting(true); }}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Confirmed badge */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
          <Check className="h-3 w-3" strokeWidth={3} />
          BOOKING CONFIRMED
        </div>
        {referenceId && (
          <span className="text-xs text-gray-400">Ref #{referenceId.slice(0, 8).toUpperCase()}</span>
        )}
      </div>

      <h2 className="text-3xl font-bold text-black">
        Your concierge service{" "}
        <em className="font-bold italic text-gray-400">is on the way.</em>
      </h2>
      <p className="text-sm text-gray-500">
        We&apos;ve secured your appointment. A certified specialist will arrive at your preferred location.
      </p>

      {/* Arrival card */}
      <div className="rounded-xl bg-gray-950 p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">We&apos;ll confirm within</p>
        <p className="mt-1 font-serif text-3xl font-bold">2 Hours</p>
        <p className="mt-1 text-sm text-gray-400">A coordinator will call you to finalise the appointment time.</p>
      </div>

      {/* Vehicle & service */}
      <div className="rounded-xl border border-gray-200 bg-stone-50 p-5 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Service Details</h3>
        <Separator />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-400">Vehicle</p>
            <p className="font-semibold text-black">{state.vehicleMake} {state.vehicleModel}</p>
            <p className="text-xs text-gray-500">{state.vehicleYear}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Glass Type</p>
            <p className="font-semibold text-black">
              {state.glassType === "front" ? "Front Windshield" : "Rear / Door Glass"}
            </p>
            <p className="text-xs text-gray-500">OEM Specification</p>
          </div>
          {state.appointmentDate && (
            <div>
              <p className="text-xs text-gray-400">Date</p>
              <p className="font-semibold text-black">{formatDate(state.appointmentDate)}</p>
            </div>
          )}
          {state.appointmentTime && (
            <div>
              <p className="text-xs text-gray-400">Time</p>
              <p className="font-semibold text-black">{formatTime(state.appointmentTime)}</p>
            </div>
          )}
        </div>

        {/* Service investment */}
        {state.quoteAmount ? (
          <div className="rounded-lg bg-black p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Service Investment</p>
            <p className="mt-1 font-serif text-3xl font-bold text-white">{formatINR(state.quoteAmount)}</p>
            <p className="mt-1 text-xs text-gray-500">Inclusive of doorstep fee, OEM glass &amp; taxes.</p>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-teal-400">
              <Check className="h-3 w-3" strokeWidth={3} />
              FIXED PRICE GUARANTEE
            </div>
          </div>
        ) : null}

        {/* Inclusions */}
        <div className="space-y-1.5">
          {["Lifetime Leakage Warranty", "ADAS Sensor Recalibration"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-gray-600">
              <Check className="h-3 w-3 text-teal-500" strokeWidth={3} />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Destination */}
      {state.serviceAddress && (
        <div className="rounded-xl border border-gray-200 p-5 space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Destination</h3>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
            <div>
              <p className="font-semibold text-black">{state.serviceAddress}</p>
              <p className="text-xs text-gray-500">PIN {state.servicePin} · {state.serviceCity}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment methods */}
      <div className="rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Payment</h3>
        <div className="flex flex-wrap gap-2">
          {["UPI", "Credit / Debit Card", "Cash"].map((method) => (
            <span key={method} className="rounded border border-gray-200 px-2.5 py-1 text-xs text-gray-500">
              {method}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400">Collected after service is complete. No advance required.</p>
      </div>

      {/* Concierge support */}
      <div className="rounded-xl border border-gray-100 bg-stone-50 p-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Concierge Support</p>
        <p className="text-sm text-gray-600">
          Questions before your appointment? Reach us directly.
        </p>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1 gap-2">
            <a href={`tel:${PHONE.replace(/\s/g, "")}`}>
              <Phone className="h-3.5 w-3.5" /> Call Us
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1 gap-2">
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hi, booking ref ${referenceId?.slice(0, 8).toUpperCase()} — need help.`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
          </Button>
        </div>
      </div>

      <Button asChild variant="outline" size="sm" className="w-full text-gray-500">
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  );
}

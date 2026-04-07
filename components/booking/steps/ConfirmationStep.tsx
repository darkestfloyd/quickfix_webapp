"use client";

import { useEffect, useRef, useState } from "react";
import { useBooking } from "../BookingStore";
import { trackLeadSubmit, trackStepComplete } from "@/lib/meta-events";
import { getStoredAttribution } from "@/lib/attribution";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Phone, MessageCircle, Check } from "lucide-react";
import Link from "next/link";

const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 98765 43210";
const WHATSAPP = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "919876543210";

export function ConfirmationStep() {
  const { state, sessionId, dispatch } = useBooking();
  const [submitting, setSubmitting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const submitted = useRef(false);

  useEffect(() => {
    if (submitted.current) return;
    submitted.current = true;

    const attribution = getStoredAttribution();
    const eventId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const payload = {
      vehicleYear: state.vehicleYear,
      vehicleMake: state.vehicleMake,
      vehicleModel: state.vehicleModel,
      customerName: state.customerName,
      customerPhone: state.customerPhone,
      customerEmail: state.customerEmail,
      sessionId,
      eventId,
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
          trackLeadSubmit(0, eventId);
          trackStepComplete(3, "Confirmation");
          fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, eventType: "lead_submit", step: 3, metadata: { referenceId: data.referenceId } }),
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
        <p className="font-semibold text-black">Submitting your quote request...</p>
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

      {/* Received badge */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
          <Check className="h-3 w-3" strokeWidth={3} />
          QUOTE REQUEST RECEIVED
        </div>
        {referenceId && (
          <span className="text-xs text-gray-400">Ref #{referenceId.slice(0, 8).toUpperCase()}</span>
        )}
      </div>

      <h2 className="text-3xl font-bold text-black">
        We&apos;ve received your{" "}
        <em className="font-bold italic text-gray-400">quote request.</em>
      </h2>
      <p className="text-sm text-gray-500">
        Our team will review your details and call you with the exact quote amount.
      </p>

      {/* Response timeline */}
      <div className="rounded-xl bg-gray-950 p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">We&apos;ll call you within</p>
        <p className="mt-1 font-serif text-3xl font-bold">24 Hours</p>
        <p className="mt-1 text-sm text-gray-400">Our team will contact you on your provided number with the exact quote amount.</p>
      </div>

      {/* Request details */}
      <div className="rounded-xl border border-gray-200 bg-stone-50 p-5 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Request Details</h3>
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
          <div>
            <p className="text-xs text-gray-400">Contact Number</p>
            <p className="font-semibold text-black">+91 {state.customerPhone}</p>
            <p className="text-xs text-gray-500">We&apos;ll call this number</p>
          </div>
        </div>

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

      {/* Concierge support */}
      <div className="rounded-xl border border-gray-100 bg-stone-50 p-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Concierge Support</p>
        <p className="text-sm text-gray-600">
          Questions about your quote? Reach us directly.
        </p>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1 gap-2">
            <a href={`tel:${PHONE.replace(/\s/g, "")}`}>
              <Phone className="h-3.5 w-3.5" /> Call Us
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1 gap-2">
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hi, quote ref ${referenceId?.slice(0, 8).toUpperCase()} — need help.`}
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

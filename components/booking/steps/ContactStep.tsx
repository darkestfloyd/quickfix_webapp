"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBooking } from "../BookingStore";
import { trackStepComplete } from "@/lib/meta-events";
import { formatINR } from "@/lib/utils";
import { Shield, Check, Phone, FileText } from "lucide-react";

const schema = z.object({
  customerName: z.string().min(2, "Enter your full name"),
  customerPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  customerEmail: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
});
type FormData = z.infer<typeof schema>;

const ICONS = [
  { icon: Shield, label: "NO SURPRISES" },
  { icon: FileText, label: "FULL INVOICE" },
  { icon: Phone, label: "QUICK SUPPORT" },
];

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(timeStr?: string) {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

// Fixed slot end times keyed by start time HH
const SLOT_END: Record<string, string> = {
  "09": "12:00 PM",
  "12": "2:00 PM",
  "14": "5:00 PM",
};

function formatSlotWindow(timeStr?: string) {
  if (!timeStr) return "—";
  const hh = timeStr.slice(0, 2);
  const end = SLOT_END[hh];
  return end ? `${formatTime(timeStr)} – ${end}` : formatTime(timeStr);
}

export function ContactStep() {
  const { dispatch, goToStep, sessionId, state } = useBooking();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: state.customerName ?? "",
      customerPhone: state.customerPhone ?? "",
      customerEmail: state.customerEmail ?? "",
    },
  });

  const onSubmit = (data: FormData) => {
    dispatch({
      type: "SET_CONTACT",
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
    });
    trackStepComplete(3, "Contact");
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, eventType: "step_complete", step: 3 }),
    }).catch(() => {});
    goToStep(4);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* Left: Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-black">
            Secure Your Concierge{" "}
            <em className="font-bold italic text-gray-400">Service</em>
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Provide your contact details. A dedicated coordinator will call within 15 minutes to finalise the logistics.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Full Name
          </Label>
          <Input
            autoComplete="name"
            placeholder="Arjun Malhotra"
            className="h-12 rounded-lg border-gray-200 focus-visible:border-black focus-visible:ring-0"
            {...register("customerName")}
          />
          {errors.customerName && <p className="text-xs text-red-500">{errors.customerName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Email Address
          </Label>
          <Input
            type="email"
            autoComplete="email"
            placeholder="arjun@corporate.in"
            className="h-12 rounded-lg border-gray-200 focus-visible:border-black focus-visible:ring-0"
            {...register("customerEmail")}
          />
          {errors.customerEmail && <p className="text-xs text-red-500">{errors.customerEmail.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Mobile Number
          </Label>
          <div className="flex gap-2">
            <span className="flex h-12 items-center rounded-lg border border-gray-200 bg-stone-50 px-3 text-sm text-gray-500">
              +91
            </span>
            <Input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              placeholder="98765 43210"
              className="h-12 flex-1 rounded-lg border-gray-200 focus-visible:border-black focus-visible:ring-0"
              {...register("customerPhone")}
            />
          </div>
          {errors.customerPhone && <p className="text-xs text-red-500">{errors.customerPhone.message}</p>}
        </div>

        <Button type="submit" variant="black" size="lg" className="w-full">
          CONFIRM QUOTE REQUEST →
        </Button>

        <p className="text-xs leading-relaxed text-gray-400">
          By confirming, you agree to be contacted by a QuickFix technician coordinator. All service personnel are background-verified.
        </p>
      </form>

      {/* Right: Booking Summary — desktop only */}
      <aside className="hidden lg:block">
        <div className="rounded-xl border border-gray-200 bg-stone-50 p-6">
          <h3 className="font-serif text-lg font-bold italic text-black">Booking Summary</h3>

          <div className="mt-5 space-y-4 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Vehicle</span>
              <div className="text-right">
                <p className="font-semibold text-black">{state.vehicleMake} {state.vehicleModel}</p>
                <p className="text-xs text-gray-500">{state.vehicleYear} · {state.glassType === "front" ? "Front Windshield" : "Rear / Door Glass"}</p>
              </div>
            </div>

            {state.appointmentDate && (
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Service Date</span>
                <p className="font-semibold text-black">{formatDate(state.appointmentDate)}</p>
              </div>
            )}

            {state.appointmentTime && (
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Preferred Slot</span>
                <p className="font-semibold text-black">{formatSlotWindow(state.appointmentTime)}</p>
              </div>
            )}

            {state.serviceCity && (
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Location</span>
                <p className="font-semibold text-black">{state.serviceCity}</p>
              </div>
            )}

            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Doorstep Fee</span>
              <p className="font-semibold text-teal-600">FREE</p>
            </div>

            {state.quoteAmount ? (
              <div className="flex justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Estimated</span>
                <p className="font-serif text-xl font-bold text-black">{formatINR(state.quoteAmount)}</p>
              </div>
            ) : null}
          </div>

          {/* Warranty badge */}
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 p-3">
            <Check className="h-4 w-4 shrink-0 text-teal-600" strokeWidth={3} />
            <p className="text-xs font-semibold text-teal-700">1-YEAR BUBBLE-FREE WARRANTY INCLUDED</p>
          </div>

          {/* Service icons */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {ICONS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 rounded-lg border border-gray-100 bg-white p-2.5 text-center">
                <Icon className="h-4 w-4 text-gray-500" />
                <p className="text-xs font-semibold text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBooking } from "../BookingStore";
import { trackStepComplete } from "@/lib/meta-events";
import { Loader2, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import type { AvailabilitySlot } from "@/types";

const schema = z.object({
  servicePin: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  serviceAddress: z.string().min(10, "Please enter a full address (at least 10 characters)"),
  appointmentDate: z.string().min(1, "Select a date"),
  slotId: z.number({ required_error: "Select a time slot" }),
});
type FormData = z.infer<typeof schema>;

interface SlotsByDate {
  [date: string]: AvailabilitySlot[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export function LocationStep() {
  const { dispatch, goToStep, sessionId } = useBooking();
  const [pinStatus, setPinStatus] = useState<"idle" | "loading" | "covered" | "uncovered">("idle");
  const [city, setCity] = useState<string>("");
  const [slots, setSlots] = useState<SlotsByDate>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const pin = watch("servicePin");

  // Check PIN coverage when 6 digits entered
  useEffect(() => {
    if (!pin || !/^\d{6}$/.test(pin)) {
      setPinStatus("idle");
      setSlots({});
      return;
    }
    setPinStatus("loading");
    fetch(`/api/availability?pin=${pin}`)
      .then((r) => r.json())
      .then((data: { covered: boolean; city?: string; slots?: AvailabilitySlot[] }) => {
        if (data.covered) {
          setPinStatus("covered");
          setCity(data.city ?? "");
          // Group slots by date
          const grouped: SlotsByDate = {};
          for (const slot of data.slots ?? []) {
            if (!grouped[slot.date]) grouped[slot.date] = [];
            grouped[slot.date].push(slot);
          }
          setSlots(grouped);
        } else {
          setPinStatus("uncovered");
          setSlots({});
        }
      })
      .catch(() => setPinStatus("idle"));
  }, [pin]);

  const dates = Object.keys(slots).sort();

  const onSubmit = (data: FormData) => {
    if (!selectedSlot) return;
    dispatch({
      type: "SET_LOCATION",
      servicePin: data.servicePin,
      serviceCity: city,
      serviceAddress: data.serviceAddress,
      appointmentDate: selectedSlot.date,
      appointmentTime: selectedSlot.time,
      slotId: selectedSlot.id,
      pinCovered: pinStatus === "covered",
    });
    trackStepComplete(2, "Location");
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, eventType: "step_complete", step: 2, metadata: { city, pin: data.servicePin } }),
    }).catch(() => {});
    goToStep(3);
  };

  // Allow submit even for uncovered PINs
  const canSubmit = watch("serviceAddress")?.length >= 10 && (pinStatus === "covered" ? !!selectedSlot : pinStatus === "uncovered");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Where &amp; When?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We'll come to your location at your chosen time.
        </p>
      </div>

      {/* PIN Code */}
      <div className="space-y-1.5">
        <Label htmlFor="pin">PIN Code</Label>
        <div className="relative">
          <Input
            id="pin"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit PIN code"
            className="h-12 pr-10"
            {...register("servicePin")}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {pinStatus === "loading" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {pinStatus === "covered" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            {pinStatus === "uncovered" && <AlertCircle className="h-4 w-4 text-orange-500" />}
          </div>
        </div>
        {errors.servicePin && <p className="text-xs text-destructive">{errors.servicePin.message}</p>}
        {pinStatus === "covered" && city && (
          <p className="flex items-center gap-1 text-xs text-green-600">
            <MapPin className="h-3 w-3" /> We service {city} — slots available below.
          </p>
        )}
        {pinStatus === "uncovered" && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-xs text-orange-700">
            <p className="font-medium">Outside our current coverage area</p>
            <p className="mt-0.5">Submit your request anyway — we'll contact you to confirm availability or schedule for a nearby date.</p>
          </div>
        )}
      </div>

      {/* Service Address */}
      <div className="space-y-1.5">
        <Label htmlFor="address">Service Address</Label>
        <Textarea
          id="address"
          placeholder="Flat / House no., Building, Street, Area, City"
          className="min-h-[80px]"
          {...register("serviceAddress")}
        />
        {errors.serviceAddress && <p className="text-xs text-destructive">{errors.serviceAddress.message}</p>}
      </div>

      {/* Date & Slot selection (only for covered PINs) */}
      {pinStatus === "covered" && dates.length > 0 && (
        <>
          <div className="space-y-2">
            <Label>Select Date</Label>
            <div className="flex flex-wrap gap-2">
              {dates.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setSelectedDate(d);
                    setSelectedSlot(null);
                    setValue("appointmentDate", d);
                  }}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    selectedDate === d
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-amber-300"
                  }`}
                >
                  {formatDate(d)}
                </button>
              ))}
            </div>
            {errors.appointmentDate && <p className="text-xs text-destructive">{errors.appointmentDate.message}</p>}
          </div>

          {selectedDate && slots[selectedDate] && (
            <div className="space-y-2">
              <Label>Select Time Slot</Label>
              <div className="grid grid-cols-2 gap-2">
                {slots[selectedDate].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      setSelectedSlot(slot);
                      setValue("slotId", slot.id);
                    }}
                    className={`rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                      selectedSlot?.id === slot.id
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-amber-300"
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
              {errors.slotId && <p className="text-xs text-destructive">{errors.slotId.message}</p>}
            </div>
          )}
        </>
      )}

      <Button
        type="submit"
        variant="amber"
        size="lg"
        className="w-full"
        disabled={!canSubmit}
      >
        Continue to Contact →
      </Button>
    </form>
  );
}

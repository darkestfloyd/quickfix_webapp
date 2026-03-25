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
import { Loader2, MapPin, AlertCircle, CheckCircle2, Check } from "lucide-react";
import { cn, istTomorrow } from "@/lib/utils";
import type { AvailabilitySlot } from "@/types";

const schema = z.object({
  servicePin: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  serviceAddress: z.string().min(10, "Please enter a full address (at least 10 characters)"),
  appointmentDate: z.string().min(1, "Select a date"),
  slotId: z.number({ required_error: "Select a time slot" }),
});
type FormData = z.infer<typeof schema>;

interface SlotsByDate { [date: string]: AvailabilitySlot[] }

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function formatDayLabel(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return { day: DAYS[d.getDay()], num: d.getDate() };
}

function getMonthLabel(dates: string[]): string {
  if (!dates.length) return "";
  const d = new Date(dates[0] + "T00:00:00");
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// Use shared IST utility so client and server agree on "tomorrow"
const getTomorrowStr = istTomorrow;

function isSlotBlocked(slot: AvailabilitySlot): boolean {
  if (!slot.available) return true;
  // Tomorrow's first slot (9am) is always blocked
  if (slot.date === getTomorrowStr() && slot.time.startsWith("09")) return true;
  return false;
}

export function LocationStep() {
  const { dispatch, goToStep, sessionId } = useBooking();
  const [pinStatus, setPinStatus] = useState<"idle" | "loading" | "covered" | "uncovered">("idle");
  const [city, setCity] = useState("");
  const [slots, setSlots] = useState<SlotsByDate>({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const pin = watch("servicePin");

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
  const monthLabel = getMonthLabel(dates);

  const onSubmit = (data: FormData) => {
    if (!selectedSlot && pinStatus === "covered") return;
    dispatch({
      type: "SET_LOCATION",
      servicePin: data.servicePin,
      serviceCity: city,
      serviceAddress: data.serviceAddress,
      appointmentDate: selectedSlot?.date ?? "",
      appointmentTime: selectedSlot?.time ?? "",
      slotId: selectedSlot?.id ?? 0,
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

  const canSubmit = watch("serviceAddress")?.length >= 10 &&
    (pinStatus === "covered" ? !!selectedSlot : pinStatus === "uncovered");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-black">
          Where should we{" "}
          <em className="font-bold italic text-gray-400">meet you?</em>
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Our specialists provide doorstep service across major Indian metros. Pin your location below.
        </p>
      </div>

      {/* PIN / Location input */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Location PIN Code
        </Label>
        <div className="relative flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 focus-within:border-black">
          <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit PIN code"
            className="flex-1 py-3 text-sm outline-none placeholder:text-gray-400"
            {...register("servicePin")}
          />
          <div className="shrink-0">
            {pinStatus === "loading" && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
            {pinStatus === "covered" && <CheckCircle2 className="h-4 w-4 text-teal-500" />}
            {pinStatus === "uncovered" && <AlertCircle className="h-4 w-4 text-gray-400" />}
          </div>
        </div>
        {errors.servicePin && <p className="text-xs text-red-500">{errors.servicePin.message}</p>}
        {pinStatus === "covered" && city && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-teal-600">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
            Service Area Marked — {city}
          </div>
        )}
        {pinStatus === "uncovered" && (
          <p className="text-xs text-gray-500">
            Outside current coverage. Submit anyway — we&apos;ll confirm availability within 2 hours.
          </p>
        )}
      </div>

      {/* Service Address */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Service Address
        </Label>
        <Textarea
          placeholder="Flat / House, Building, Street, Colony, City"
          className="min-h-[80px] rounded-lg border-gray-200 focus-visible:border-black focus-visible:ring-0"
          {...register("serviceAddress")}
        />
        {errors.serviceAddress && <p className="text-xs text-red-500">{errors.serviceAddress.message}</p>}
      </div>

      {/* Calendar + slots for covered PINs */}
      {pinStatus === "covered" && dates.length > 0 && (
        <div className="space-y-6 rounded-xl border border-gray-100 bg-stone-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Select a time that suits your schedule
          </p>

          {/* Month header */}
          <div className="flex items-center">
            <span className="text-sm font-semibold text-black">{monthLabel}</span>
          </div>

          {/* Date strip */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {dates.map((d) => {
              const { day, num } = formatDayLabel(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setSelectedDate(d);
                    setSelectedSlot(null);
                    setValue("appointmentDate", d);
                  }}
                  className={cn(
                    "flex shrink-0 flex-col items-center rounded-lg px-3 py-2.5 text-center transition-colors",
                    selectedDate === d
                      ? "bg-black text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <span className="text-xs">{day}</span>
                  <span className="text-lg font-bold leading-tight">{num}</span>
                </button>
              );
            })}
          </div>
          {errors.appointmentDate && <p className="text-xs text-red-500">{errors.appointmentDate.message}</p>}

          {/* Time slots */}
          {selectedDate && slots[selectedDate] && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Available Slots
              </p>
              <div className="grid grid-cols-2 gap-2">
                {slots[selectedDate].map((slot) => {
                  const blocked = isSlotBlocked(slot);
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={blocked}
                      onClick={() => {
                        if (blocked) return;
                        setSelectedSlot(slot);
                        setValue("slotId", slot.id);
                      }}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm transition-colors",
                        blocked
                          ? "cursor-not-allowed border border-gray-200 bg-gray-50 opacity-50"
                          : selectedSlot?.id === slot.id
                          ? "bg-black text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <span className="font-medium">{slot.label}</span>
                      {!blocked && selectedSlot?.id === slot.id && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
              {errors.slotId && <p className="text-xs text-red-500">{errors.slotId.message}</p>}
            </div>
          )}

          {/* Summary pill */}
          {selectedSlot && (
            <div className="flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm text-teal-700">
              <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />
              <span className="font-medium">
                Scheduled for {new Date(selectedSlot.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })},{" "}
                {selectedSlot.label.split("–")[0].trim()}
              </span>
            </div>
          )}
        </div>
      )}

      <Button
        type="submit"
        variant="black"
        size="lg"
        className="w-full"
        disabled={!canSubmit}
      >
        CONFIRM APPOINTMENT →
      </Button>
    </form>
  );
}

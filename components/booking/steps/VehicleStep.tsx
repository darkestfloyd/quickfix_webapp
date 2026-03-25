"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBooking } from "../BookingStore";
import { trackQuoteView, trackStepComplete } from "@/lib/meta-events";
import { formatINR, cn } from "@/lib/utils";
import { Shield, Check } from "lucide-react";

const schema = z.object({
  make: z.string().min(1, "Select a make"),
  model: z.string().min(1, "Select a model"),
  year: z.number({ required_error: "Select a year" }),
  glassType: z.enum(["front", "rear"], { required_error: "Select glass type" }),
});
type FormData = z.infer<typeof schema>;

interface VehicleOption {
  year: number;
  make: string;
  model: string;
  currentPrice: string;
}

const YEARS = Array.from({ length: 10 }, (_, i) => 2024 - i);

// Primary makes shown in grid; others fall through to "Other" selection
const GRID_MAKES = ["Maruti Suzuki", "Hyundai", "Tata", "Honda", "Toyota"];

const GLASS_OPTIONS: { value: "front" | "rear"; label: string; sub: string }[] = [
  { value: "front", label: "Front Windshield", sub: "Includes rain sensor calibration" },
  { value: "rear", label: "Rear / Door Glass", sub: "Tempered safety glass" },
];

export function VehicleStep() {
  const { dispatch, goToStep, sessionId } = useBooking();
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [quote, setQuote] = useState<number | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const selectedMake = watch("make");
  const selectedModel = watch("model");
  const selectedYear = watch("year");
  const selectedGlass = watch("glassType");

  // Load vehicles on mount — response is HTTP-cached for 1 hour
  useEffect(() => {
    fetch("/api/quote")
      .then((r) => r.json())
      .then((data: { vehicles: VehicleOption[] }) => setVehicles(data.vehicles))
      .catch(() => {});
  }, []);

  const allMakes = Array.from(new Set(vehicles.map((v) => v.make))).sort();
  const otherMakes = allMakes.filter((m) => !GRID_MAKES.includes(m));
  const models = Array.from(new Set(
    vehicles.filter((v) => v.make === selectedMake).map((v) => v.model)
  )).sort();

  // Instant client-side price lookup — no network call needed
  useEffect(() => {
    if (!selectedYear || !selectedMake || !selectedModel) return;

    const match = vehicles.find(
      (v) => v.make === selectedMake && v.model === selectedModel && v.year === selectedYear
    );

    if (match) {
      const price = parseFloat(match.currentPrice);
      setQuote(price);
      setQuoteError(null);
      trackQuoteView(price);
    } else {
      setQuote(null);
      setQuoteError("Vehicle not in our price list. We'll contact you with a custom quote.");
    }
  }, [selectedYear, selectedMake, selectedModel, vehicles]);

  const onSubmit = (data: FormData) => {
    if (!quote && !quoteError) return;
    dispatch({
      type: "SET_VEHICLE",
      year: data.year,
      make: data.make,
      model: data.model,
      quoteAmount: quote ?? 0,
      glassType: data.glassType,
    });
    trackStepComplete(1, "Vehicle");
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, eventType: "step_complete", step: 1, metadata: { make: data.make, model: data.model, glassType: data.glassType } }),
    }).catch(() => {});
    goToStep(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-black">
          Let&apos;s identify your{" "}
          <em className="font-bold italic text-gray-400">vehicle</em>.
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Precision is paramount. Select your car details for an exact quote.
        </p>
      </div>

      {/* Step 01: Vehicle Make — brand grid */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          01. Vehicle Make
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {GRID_MAKES.map((make) => (
            <button
              key={make}
              type="button"
              onClick={() => {
                setValue("make", make, { shouldValidate: true });
                setValue("model", "");
                setQuote(null);
              }}
              className={cn(
                "rounded-lg border px-3 py-3 text-center text-sm font-medium transition-colors",
                selectedMake === make
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              )}
            >
              {make}
            </button>
          ))}
          {/* Other makes via select */}
          <div className={cn(
            "rounded-lg border transition-colors",
            selectedMake && !GRID_MAKES.includes(selectedMake)
              ? "border-black bg-black"
              : "border-gray-200 bg-white"
          )}>
            <select
              className={cn(
                "h-full w-full rounded-lg bg-transparent px-3 py-3 text-sm font-medium outline-none",
                selectedMake && !GRID_MAKES.includes(selectedMake) ? "text-white" : "text-gray-500"
              )}
              value={GRID_MAKES.includes(selectedMake ?? "") ? "" : (selectedMake ?? "")}
              onChange={(e) => {
                if (e.target.value) {
                  setValue("make", e.target.value, { shouldValidate: true });
                  setValue("model", "");
                  setQuote(null);
                }
              }}
            >
              <option value="">Other</option>
              {otherMakes.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        {errors.make && <p className="text-xs text-red-500">{errors.make.message}</p>}
      </div>

      {/* Step 02: Model */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          02. Model
        </p>
        <Select
          disabled={!selectedMake}
          onValueChange={(v) => { setValue("model", v, { shouldValidate: true }); setQuote(null); }}
        >
          <SelectTrigger className="h-12 rounded-lg border-gray-200">
            <SelectValue placeholder={selectedMake ? "Choose Model" : "Select make first"} />
          </SelectTrigger>
          <SelectContent>
            {models.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.model && <p className="text-xs text-red-500">{errors.model.message}</p>}
      </div>

      {/* Step 03: Year */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          03. Manufacturing Year
        </p>
        <Select
          disabled={!selectedModel}
          onValueChange={(v) => setValue("year", parseInt(v), { shouldValidate: true })}
        >
          <SelectTrigger className="h-12 rounded-lg border-gray-200">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.year && <p className="text-xs text-red-500">{errors.year.message}</p>}
      </div>

      {/* Step 04: Glass Type */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          04. Glass Type
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {GLASS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue("glassType", opt.value, { shouldValidate: true })}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                selectedGlass === opt.value
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white hover:border-gray-400"
              )}
            >
              <div className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                selectedGlass === opt.value ? "border-white bg-white" : "border-gray-300"
              )}>
                {selectedGlass === opt.value && (
                  <div className="h-2 w-2 rounded-full bg-black" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">{opt.label}</p>
                <p className={cn("text-xs", selectedGlass === opt.value ? "text-gray-300" : "text-gray-500")}>
                  {opt.sub}
                </p>
              </div>
            </button>
          ))}
        </div>
        {errors.glassType && <p className="text-xs text-red-500">{errors.glassType.message}</p>}
      </div>

      {/* Quote display — appears instantly on year selection */}
      {quote && (
        <div className="animate-fade-in rounded-xl border border-gray-200 bg-stone-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Estimated Quote</p>
              <p className="mt-1 font-serif text-4xl font-bold text-black">{formatINR(quote)}</p>
              <p className="mt-1 text-xs text-gray-500">Includes all materials &amp; labour</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
              <Check className="h-3 w-3" />
              Fixed Price
            </div>
          </div>
        </div>
      )}

      {quoteError && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          <p className="font-semibold">Vehicle not in our price list</p>
          <p className="mt-1 text-xs text-gray-500">
            Proceed anyway — we&apos;ll contact you with a custom quote within 2 hours.
          </p>
        </div>
      )}

      {/* Concierge guarantee */}
      <div className="flex items-start gap-3 rounded-lg border border-teal-200 bg-teal-50 p-4">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Concierge Guarantee</p>
          <p className="mt-0.5 text-xs text-teal-600">
            We source only OEM-grade glass matched to your vehicle. No substandard alternatives.
          </p>
        </div>
      </div>

      {/* Instant booking */}
      <div className="flex items-center gap-2 text-xs text-teal-600">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
        <span className="font-semibold uppercase tracking-wide">Instant Booking Available</span>
      </div>

      <Button
        type="submit"
        variant="black"
        size="lg"
        className="w-full"
        disabled={!selectedModel || !selectedGlass || (!quote && !quoteError)}
      >
        CONTINUE TO SCHEDULE →
      </Button>
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useBooking } from "../BookingStore";
import { trackQuoteView, trackStepComplete } from "@/lib/meta-events";
import { formatINR } from "@/lib/utils";
import { Loader2, Car } from "lucide-react";

const schema = z.object({
  year: z.number({ required_error: "Select year" }),
  make: z.string().min(1, "Select make"),
  model: z.string().min(1, "Select model"),
});
type FormData = z.infer<typeof schema>;

interface VehicleOption {
  year: number;
  make: string;
  model: string;
}

const YEARS = Array.from({ length: 10 }, (_, i) => 2024 - i);

export function VehicleStep() {
  const { dispatch, goToStep, sessionId } = useBooking();
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [quote, setQuote] = useState<number | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const selectedYear = watch("year");
  const selectedMake = watch("make");
  const selectedModel = watch("model");

  // Load vehicles on mount
  useEffect(() => {
    fetch("/api/quote")
      .then((r) => r.json())
      .then((data: { vehicles: VehicleOption[] }) => setVehicles(data.vehicles))
      .catch(() => {});
  }, []);

  const makes = Array.from(new Set(vehicles.map((v) => v.make))).sort();
  const models = vehicles
    .filter((v) => v.make === selectedMake)
    .map((v) => v.model)
    .sort();

  // Fetch quote when model is selected
  useEffect(() => {
    if (!selectedYear || !selectedMake || !selectedModel) return;
    setQuoteLoading(true);
    setQuoteError(null);
    setQuote(null);

    fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year: selectedYear, make: selectedMake, model: selectedModel }),
    })
      .then((r) => r.json())
      .then((data: { quote?: number; error?: string }) => {
        if (data.quote) {
          setQuote(data.quote);
          trackQuoteView(data.quote);
        } else {
          setQuoteError(data.error ?? "Unable to fetch quote");
        }
      })
      .catch(() => setQuoteError("Network error. Please try again."))
      .finally(() => setQuoteLoading(false));
  }, [selectedYear, selectedMake, selectedModel]);

  const onSubmit = (data: FormData) => {
    if (!quote) return;
    dispatch({ type: "SET_VEHICLE", year: data.year, make: data.make, model: data.model, quoteAmount: quote });
    trackStepComplete(1, "Vehicle");
    // Track server-side
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, eventType: "step_complete", step: 1, metadata: { make: data.make, model: data.model } }),
    }).catch(() => {});
    goToStep(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">What car do you have?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We'll show you the exact price for your vehicle.
        </p>
      </div>

      {/* Year */}
      <div className="space-y-1.5">
        <Label htmlFor="year">Year</Label>
        <Select
          onValueChange={(v) => {
            setValue("year", parseInt(v), { shouldValidate: true });
            setValue("make", "");
            setValue("model", "");
            setQuote(null);
          }}
        >
          <SelectTrigger id="year" className="h-12">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.year && <p className="text-xs text-destructive">{errors.year.message}</p>}
      </div>

      {/* Make */}
      <div className="space-y-1.5">
        <Label htmlFor="make">Make</Label>
        <Select
          disabled={!selectedYear}
          onValueChange={(v) => {
            setValue("make", v, { shouldValidate: true });
            setValue("model", "");
            setQuote(null);
          }}
        >
          <SelectTrigger id="make" className="h-12">
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent>
            {makes.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.make && <p className="text-xs text-destructive">{errors.make.message}</p>}
      </div>

      {/* Model */}
      <div className="space-y-1.5">
        <Label htmlFor="model">Model</Label>
        <Select
          disabled={!selectedMake}
          onValueChange={(v) => setValue("model", v, { shouldValidate: true })}
        >
          <SelectTrigger id="model" className="h-12">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
      </div>

      {/* Quote display */}
      {quoteLoading && (
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Fetching your quote...
        </div>
      )}

      {quote && !quoteLoading && (
        <div className="animate-fade-in rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700 font-medium">Your estimated quote</p>
              <p className="text-3xl font-bold text-amber-600">{formatINR(quote)}</p>
              <p className="text-xs text-amber-600/70 mt-0.5">Includes all materials &amp; labour</p>
            </div>
            <Car className="h-10 w-10 text-amber-300" />
          </div>
          <Badge variant="amber" className="mt-3 text-xs">
            Final price confirmed on booking — no hidden charges
          </Badge>
        </div>
      )}

      {quoteError && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
          <p className="font-medium">Vehicle not found in our price list</p>
          <p className="mt-1 text-xs">{quoteError}</p>
          <p className="mt-1 text-xs">You can still proceed — we'll contact you with a custom quote within 2 hours.</p>
        </div>
      )}

      <Button
        type="submit"
        variant="amber"
        size="lg"
        className="w-full"
        disabled={!selectedModel || quoteLoading || (!quote && !quoteError)}
      >
        Continue to Schedule →
      </Button>
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBooking } from "../BookingStore";
import { trackStepComplete } from "@/lib/meta-events";
import { cn } from "@/lib/utils";
import { Shield, Ban } from "lucide-react";

const schema = z.object({
  make: z.string().min(1, "Select a make"),
  model: z.string().min(1, "Select a model"),
  year: z.number({ required_error: "Select a year" }),
  glassType: z.enum(["front", "rear"], { required_error: "Select glass type" }),
});
type FormData = z.infer<typeof schema>;

interface VehicleOption {
  make: string;
  model: string;
  currentPrice: string;
}

const YEARS = Array.from({ length: 10 }, (_, i) => 2024 - i);

// Primary makes shown in grid; others appear in the "Other" picker dropdown
const GRID_MAKES = ["Maruti Suzuki", "Hyundai", "BMW", "Honda", "Toyota"];

const GLASS_OPTIONS: { value: "front" | "rear"; label: string; sub: string; disabled?: boolean }[] = [
  { value: "front", label: "Front Windshield", sub: "Includes rain sensor calibration" },
  { value: "rear", label: "Rear / Door Glass", sub: "Currently unavailable", disabled: true },
];

export function VehicleStep() {
  const { dispatch, goToStep, sessionId } = useBooking();
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  // true when user selects "Other (not listed)" from the make dropdown
  const [isFreeform, setIsFreeform] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const selectedMake = watch("make");
  const selectedModel = watch("model");
  const selectedGlass = watch("glassType");

  // Load vehicles on mount — response is HTTP-cached for 1 hour
  useEffect(() => {
    fetch("/api/quote")
      .then((r) => r.json())
      .then((data: { vehicles: VehicleOption[] }) => setVehicles(data.vehicles))
      .catch(() => {});
  }, []);

  const otherMakes = Array.from(new Set(vehicles.map((v) => v.make)))
    .filter((m) => !GRID_MAKES.includes(m))
    .sort();

  const models = Array.from(new Set(
    vehicles.filter((v) => v.make === selectedMake).map((v) => v.model)
  )).sort();

  const handleGridMake = (make: string) => {
    setIsFreeform(false);
    setValue("make", make, { shouldValidate: true });
    setValue("model", "");
  };

  const handleOtherDropdownChange = (value: string) => {
    if (value === "__other__") {
      setIsFreeform(true);
      setValue("make", "", { shouldValidate: false });
      setValue("model", "");
    } else {
      setIsFreeform(false);
      setValue("make", value, { shouldValidate: true });
      setValue("model", "");
    }
  };

  const onSubmit = (data: FormData) => {
    dispatch({
      type: "SET_VEHICLE",
      year: data.year,
      make: data.make,
      model: data.model,
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
          Select your car details so we can provide the most accurate quote.
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
              onClick={() => handleGridMake(make)}
              className={cn(
                "rounded-lg border px-3 py-3 text-center text-sm font-medium transition-colors",
                !isFreeform && selectedMake === make
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              )}
            >
              {make}
            </button>
          ))}
          {/* Dropdown for all other DB makes + "Other (not listed)" — inline as 6th grid cell */}
          <Select
            onValueChange={handleOtherDropdownChange}
            value={isFreeform ? "__other__" : (!GRID_MAKES.includes(selectedMake ?? "") && selectedMake) ? selectedMake : undefined}
          >
            <SelectTrigger className={cn(
              "h-full min-h-[46px] rounded-lg border text-sm font-medium transition-colors",
              (isFreeform || (!GRID_MAKES.includes(selectedMake ?? "") && selectedMake))
                ? "border-black bg-black text-white"
                : "border-gray-200 bg-white text-gray-500"
            )}>
              <SelectValue placeholder="Other…" />
            </SelectTrigger>
            <SelectContent>
              {otherMakes.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
              <SelectItem value="__other__">Other (not listed)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Freeform inputs — only when "Other (not listed)" is selected */}
        {isFreeform && (
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Make (e.g. Kia)"
              className="h-11 rounded-lg border-gray-200 text-sm"
              onChange={(e) => setValue("make", e.target.value, { shouldValidate: true })}
            />
            <Input
              placeholder="Model (e.g. Seltos)"
              className="h-11 rounded-lg border-gray-200 text-sm"
              onChange={(e) => setValue("model", e.target.value, { shouldValidate: true })}
            />
          </div>
        )}
        {errors.make && <p className="text-xs text-red-500">{errors.make.message}</p>}
      </div>

      {/* Step 02: Model — hidden in freeform mode (model captured via text input above) */}
      {!isFreeform && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            02. Model
          </p>
          <Select
            disabled={!selectedMake}
            onValueChange={(v) => setValue("model", v, { shouldValidate: true })}
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
      )}

      {/* Step 03: Year */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          03. Manufacturing Year
        </p>
        <Select
          disabled={!isFreeform && !selectedModel}
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
              disabled={opt.disabled}
              onClick={() => !opt.disabled && setValue("glassType", opt.value, { shouldValidate: true })}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                opt.disabled
                  ? "cursor-not-allowed border-gray-200 bg-gray-50"
                  : selectedGlass === opt.value
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white hover:border-gray-400"
              )}
            >
              <div className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                opt.disabled
                  ? "border-gray-300 bg-gray-100"
                  : selectedGlass === opt.value ? "border-white bg-white" : "border-gray-300"
              )}>
                {opt.disabled
                  ? <Ban className="h-3 w-3 text-gray-400" />
                  : selectedGlass === opt.value
                  ? <div className="h-2 w-2 rounded-full bg-black" />
                  : null
                }
              </div>
              <div>
                <p className={cn(
                  "text-sm font-semibold",
                  opt.disabled ? "text-gray-400" : ""
                )}>{opt.label}</p>
                <p className={cn(
                  "text-xs",
                  opt.disabled ? "text-gray-400" : selectedGlass === opt.value ? "text-gray-300" : "text-gray-500"
                )}>
                  {opt.sub}
                </p>
              </div>
            </button>
          ))}
        </div>
        {errors.glassType && <p className="text-xs text-red-500">{errors.glassType.message}</p>}
      </div>

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

      <Button
        type="submit"
        variant="black"
        size="lg"
        className="w-full"
        disabled={(!selectedModel && !isFreeform) || !selectedGlass}
      >
        CONTINUE →
      </Button>
    </form>
  );
}

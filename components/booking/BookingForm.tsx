"use client";

import { useBooking } from "./BookingStore";
import { VehicleStep } from "./steps/VehicleStep";
import { ContactStep } from "./steps/ContactStep";
import { ConfirmationStep } from "./steps/ConfirmationStep";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  { number: 1, label: "Car Details" },
  { number: 2, label: "Contact" },
  { number: 3, label: "Confirm" },
];

export function BookingForm() {
  const { state, goToStep } = useBooking();
  const pct = Math.round(((state.step - 1) / (STEPS.length - 1)) * 100);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">

      {/* Step header */}
      <div className="mb-8">
        {/* Step label + back */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Step {String(state.step).padStart(2, "0")} of {STEPS.length}
            </p>
            <p className="text-xs text-gray-400">{pct}% complete</p>
          </div>
          {state.step > 1 && state.step < 3 && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs text-gray-400 hover:text-black"
              onClick={() => goToStep((state.step - 1) as 1 | 2 | 3)}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back
            </Button>
          )}
        </div>

        {/* Tab-style progress */}
        <div className="flex border-b border-gray-200">
          {STEPS.map((s) => (
            <div
              key={s.number}
              className={cn(
                "flex-1 pb-3 text-center text-xs font-semibold uppercase tracking-wider transition-colors",
                s.number === state.step
                  ? "border-b-2 border-black text-black"
                  : s.number < state.step
                  ? "text-teal-600"
                  : "text-gray-300"
              )}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="animate-fade-in">
        {state.step === 1 && <VehicleStep />}
        {state.step === 2 && <ContactStep />}
        {state.step === 3 && <ConfirmationStep />}
      </div>
    </div>
  );
}

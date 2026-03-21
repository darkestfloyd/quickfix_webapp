"use client";

import { Progress } from "@/components/ui/progress";
import { useBooking } from "./BookingStore";
import { VehicleStep } from "./steps/VehicleStep";
import { LocationStep } from "./steps/LocationStep";
import { ContactStep } from "./steps/ContactStep";
import { ConfirmationStep } from "./steps/ConfirmationStep";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  { number: 1, label: "Vehicle" },
  { number: 2, label: "Schedule" },
  { number: 3, label: "Contact" },
  { number: 4, label: "Confirm" },
];

export function BookingForm() {
  const { state, goToStep } = useBooking();
  const progress = ((state.step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-12">
      {/* Step header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium text-navy-900">
            Step {state.step} of {STEPS.length} — {STEPS[state.step - 1].label}
          </span>
          {state.step > 1 && state.step < 4 && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground"
              onClick={() => goToStep((state.step - 1) as 1 | 2 | 3 | 4)}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          )}
        </div>

        <Progress value={progress} className="h-1.5" />

        <div className="mt-2 flex justify-between">
          {STEPS.map((s) => (
            <span
              key={s.number}
              className={`text-xs ${
                s.number <= state.step ? "text-amber-500 font-medium" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="animate-fade-in">
        {state.step === 1 && <VehicleStep />}
        {state.step === 2 && <LocationStep />}
        {state.step === 3 && <ContactStep />}
        {state.step === 4 && <ConfirmationStep />}
      </div>
    </div>
  );
}

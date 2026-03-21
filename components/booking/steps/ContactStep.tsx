"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBooking } from "../BookingStore";
import { trackStepComplete } from "@/lib/meta-events";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Your contact details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We'll use this to confirm your appointment.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Rahul Sharma"
          className="h-12"
          {...register("customerName")}
        />
        {errors.customerName && (
          <p className="text-xs text-destructive">{errors.customerName.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Mobile Number</Label>
        <div className="flex gap-2">
          <span className="flex h-12 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
            +91
          </span>
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            placeholder="98765 43210"
            className="h-12 flex-1"
            {...register("customerPhone")}
          />
        </div>
        {errors.customerPhone && (
          <p className="text-xs text-destructive">{errors.customerPhone.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">
          Email Address{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="rahul@example.com"
          className="h-12"
          {...register("customerEmail")}
        />
        {errors.customerEmail && (
          <p className="text-xs text-destructive">{errors.customerEmail.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          We'll send your booking confirmation here.
        </p>
      </div>

      <Button type="submit" variant="amber" size="lg" className="w-full">
        Review &amp; Confirm →
      </Button>
    </form>
  );
}

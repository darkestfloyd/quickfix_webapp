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
    trackStepComplete(2, "Contact");
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, eventType: "step_complete", step: 2 }),
    }).catch(() => {});
    goToStep(3);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-black">
          Your Contact{" "}
          <em className="font-bold italic text-gray-400">Details</em>
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          We&apos;ll contact you within 24 hours with your exact quote amount.
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
          Email Address <span className="normal-case text-gray-400">(optional)</span>
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
        GET QUOTE →
      </Button>

      <p className="text-xs leading-relaxed text-gray-400">
        By submitting, you agree to be contacted by a QuickFix Windshields representative for your quote. All service personnel are background-verified.
      </p>
    </form>
  );
}

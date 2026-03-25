import type { Metadata } from "next";
import { BookingProvider } from "@/components/booking/BookingStore";
import { BookingForm } from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Get Free Quote — QuickFix Auto Glass",
  description:
    "Book your doorstep windshield repair or replacement in 3 easy steps. Get an instant quote for your car.",
};

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden border-b bg-white py-4 text-center sm:block">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-black">QuickFix Windshields</span> —{" "}
          Doorstep service · OEM glass · 1-year warranty
        </p>
      </div>
      <BookingProvider>
        <BookingForm />
      </BookingProvider>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    number: "01",
    title: "Get a Free Quote",
    description: "Select your car make, model, and year. We'll instantly show you the price — no hidden fees.",
  },
  {
    number: "02",
    title: "Pick a Time & Location",
    description: "Choose a 2-hour appointment window that fits your schedule. We come to your home, office, or anywhere.",
  },
  {
    number: "03",
    title: "We Come to You",
    description: "A certified technician arrives with all equipment. Your car is ready in 90 minutes, glass sealed in 24 hours.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-navy-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="text-muted-foreground">
            Three simple steps. Zero hassle.
          </p>
        </div>

        <div className="relative grid gap-8 sm:grid-cols-3">
          {/* Connector line (desktop) */}
          <div className="absolute left-1/6 right-1/6 top-8 hidden h-px bg-amber-200 sm:block" />

          {STEPS.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-4 border-amber-100 bg-white shadow-sm">
                <span className="text-xl font-bold text-amber-500">{step.number}</span>
              </div>
              <h3 className="mb-2 font-semibold text-navy-900">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="amber" size="lg">
            <Link href="/booking">Book Your Service →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

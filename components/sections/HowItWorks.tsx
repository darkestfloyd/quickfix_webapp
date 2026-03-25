import Link from "next/link";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    number: "01",
    title: "Virtual Quote",
    description: "Select your vehicle and glass type. Get an instant, accurate INR price — no hidden fees, no phone calls required.",
  },
  {
    number: "02",
    title: "Expert Service Arrival",
    description: "Choose a 2-hour window at your home or office. A certified technician arrives fully equipped.",
  },
  {
    number: "03",
    title: "Precision Install",
    description: "OEM-grade glass fitted and sealed. ADAS cameras recalibrated on-site. Your car is ready in 90 minutes.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-stone-100 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-600">
          The Process
        </div>
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-bold text-black sm:text-4xl">
            Effortless{" "}
            <em className="font-bold italic text-gray-400">Restoration</em>
          </h2>
          <p className="max-w-sm text-sm text-gray-500">
            Three steps. Zero hassle. We handle everything — you keep your schedule.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="relative rounded-xl bg-white p-6 shadow-sm">
              {/* Large faded number */}
              <div className="absolute right-4 top-2 font-serif text-8xl font-bold leading-none text-gray-100 select-none">
                {step.number}
              </div>
              <div className="relative">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-600">
                  Step {step.number}
                </p>
                <h3 className="mb-3 text-lg font-bold text-black">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="black" size="lg">
            <Link href="/booking">BOOK YOUR SERVICE →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

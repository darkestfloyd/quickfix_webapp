import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune"];

export function CoverageStrip() {
  return (
    <section id="coverage" className="bg-gray-950 py-14 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
              <MapPin className="h-4 w-4 text-teal-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-teal-500">
                Focused on India
              </span>
            </div>
            <h2 className="mb-2 font-serif text-2xl font-bold sm:text-3xl">
              Now Serving
            </h2>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-gray-400 sm:justify-start">
              {CITIES.map((city, i) => (
                <span key={city}>
                  {city}
                  {i < CITIES.length - 1 && <span className="ml-3 text-gray-700">·</span>}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Outside these cities? Enter your PIN code — we&apos;re expanding fast.
            </p>
          </div>

          <Button asChild variant="black" size="lg" className="shrink-0">
            <Link href="/booking">CHECK YOUR AREA →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

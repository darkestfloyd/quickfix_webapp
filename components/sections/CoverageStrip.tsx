import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune"];

export function CoverageStrip() {
  return (
    <section id="coverage" className="bg-navy-900 py-12 text-white">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <div className="mb-4 flex items-center justify-center gap-2 text-amber-400">
          <MapPin className="h-5 w-5" />
          <span className="font-semibold">Now Serving</span>
        </div>
        <div className="mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-white/80">
          {CITIES.map((city, i) => (
            <span key={city}>
              {city}
              {i < CITIES.length - 1 && (
                <span className="ml-4 text-white/30">•</span>
              )}
            </span>
          ))}
        </div>
        <p className="mb-6 text-sm text-white/55">
          Don't see your city? Enter your PIN code when booking — we're expanding fast.
        </p>
        <Button asChild variant="amber" size="lg">
          <Link href="/booking">Check Your Area & Get a Quote</Link>
        </Button>
      </div>
    </section>
  );
}

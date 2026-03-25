import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export function CoverageStrip() {
  return (
    <section id="coverage" className="bg-gray-950 py-14 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
              <MapPin className="h-4 w-4 text-teal-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-teal-500">
                Serving Bengaluru
              </span>
            </div>
            <h2 className="mb-2 font-serif text-2xl font-bold sm:text-3xl">
              Now Live in{" "}
              <em className="font-bold italic text-gray-400">Bengaluru</em>
            </h2>
          </div>

          <Button asChild variant="black" size="lg" className="shrink-0">
            <Link href="/booking">GET YOUR QUOTE →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

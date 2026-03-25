"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Star } from "lucide-react";
import { trackCTAClick } from "@/lib/meta-events";

export function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">

          {/* Left: copy */}
          <div>
            {/* Trust badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-50 px-4 py-1.5 text-sm text-teal-700">
              <Star className="h-3.5 w-3.5 fill-teal-500 text-teal-500" />
              <span>Trusted by 500+ car owners · 4.9 / 5 rating</span>
            </div>

            <h1 className="mb-5 text-4xl font-bold leading-tight text-black sm:text-5xl lg:text-6xl">
              Premium Windshield
              <br />
              Replacement{" "}
              <em className="not-italic font-bold text-gray-400">at Your</em>
              <br />
              Doorstep
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-gray-500">
              Bengaluru&apos;s premium doorstep windshield service. Certified technicians come to your home or office — OEM-grade glass, ADAS recalibration, 1-year warranty.
            </p>

            {/* Trust signals row */}
            <div className="mb-8 flex flex-wrap gap-5 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-teal-500" />
                1-Year Warranty
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-teal-500" />
                90-Minute Service
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-teal-500" />
                OEM Quality Glass
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                variant="black"
                size="xl"
                className="w-full sm:w-auto"
                onClick={trackCTAClick}
              >
                <Link href="/booking">GET FREE QUOTE →</Link>
              </Button>
              <p className="text-center text-sm text-gray-400 sm:text-left">
                No commitment · Takes 60 seconds
              </p>
            </div>
          </div>

          {/* Right: visual — desktop only */}
          <div className="hidden lg:block">
            <div className="relative overflow-hidden rounded-2xl bg-gray-950 aspect-[4/5]">
              {/* Abstract car glass silhouette using CSS */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="w-full max-w-xs">
                  {/* Windshield shape SVG */}
                  <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full opacity-20">
                    <path
                      d="M20 160 L40 60 Q50 20 80 20 L200 20 Q230 20 240 60 L260 160 Z"
                      stroke="white"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M35 155 L52 68 Q60 35 85 35 L195 35 Q220 35 228 68 L245 155 Z"
                      stroke="white"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      fill="rgba(0,201,167,0.05)"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-teal-500">Concierge Service</p>
                  <p className="font-serif text-2xl font-bold text-white">Expert Glass.<br />Your Location.</p>
                  <p className="text-sm text-gray-400">We come to you.</p>
                </div>
              </div>
              {/* Teal glow */}
              <div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

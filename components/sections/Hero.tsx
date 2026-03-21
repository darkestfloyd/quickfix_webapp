"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Star } from "lucide-react";
import { trackCTAClick } from "@/lib/meta-events";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(251,191,36,0.12),_transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24 lg:py-32">
        <div className="max-w-2xl">
          {/* Trust badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-sm text-amber-300">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>4.9 / 5 — Trusted by 500+ car owners</span>
          </div>

          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Your Windshield
            <br />
            <span className="text-amber-400">Replaced at Your</span>
            <br />
            Doorstep
          </h1>

          <p className="mb-8 text-lg text-white/75 sm:text-xl">
            Premium auto glass service — at your home, office, or wherever you are.
            OEM glass, certified technicians, 1-year warranty.
          </p>

          {/* Trust signals row */}
          <div className="mb-8 flex flex-wrap gap-4 text-sm text-white/65">
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-amber-400" />
              1-Year Warranty
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-400" />
              90-Minute Service
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-400" />
              OEM Quality Glass
            </span>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              variant="amber"
              size="xl"
              className="w-full sm:w-auto"
              onClick={trackCTAClick}
            >
              <Link href="/booking">Get Free Quote →</Link>
            </Button>
            <p className="text-center text-sm text-white/50 sm:text-left">
              No commitment • Takes 60 seconds
            </p>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 0C1200 40 960 60 720 40C480 20 240 0 0 20L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

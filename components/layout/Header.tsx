"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 98765 43210";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-navy-900/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">
            Quick<span className="text-amber-400">Fix</span>
          </span>
          <span className="hidden text-xs text-white/60 sm:block">Auto Glass</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white/80 md:flex">
          <Link href="/#services" className="hover:text-white transition-colors">Services</Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
          <Link href="/#coverage" className="hover:text-white transition-colors">Coverage</Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            className="hidden items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors sm:flex"
          >
            <Phone className="h-4 w-4" />
            <span>{PHONE}</span>
          </a>
          <Button asChild variant="amber" size="sm">
            <Link href="/booking">Get Free Quote</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

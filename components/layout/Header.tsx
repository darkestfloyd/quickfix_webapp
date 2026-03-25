"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";

const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 98765 43210";

const NAV_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#how-it-works", label: "Process" },
  { href: "/#coverage", label: "Coverage" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5" onClick={() => setMobileOpen(false)}>
          <span className="font-serif text-xl font-bold tracking-tight text-black">
            QuickFix
          </span>
          <span className="hidden text-xs font-normal text-gray-400 sm:block">Windshields</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-black transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden items-center gap-4 md:flex">
          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            {PHONE}
          </a>
          <Button asChild variant="black" size="sm">
            <Link href="/booking">Get Free Quote</Link>
          </Button>
        </div>

        {/* Mobile right */}
        <div className="flex items-center gap-2 md:hidden">
          <Button asChild variant="black" size="sm" className="text-xs">
            <Link href="/booking">Quote</Link>
          </Button>
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="mt-2 flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {PHONE}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 98765 43210";

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white/70">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="mb-1 text-xl font-bold text-white">
              Quick<span className="text-amber-400">Fix</span> Auto Glass
            </p>
            <p className="mb-4 text-sm">
              Premium doorstep windshield repair and replacement service. We come to you — at home, office, or wherever you are.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/10 px-3 py-1">UPI Accepted</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Credit / Debit Card</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Cash</span>
            </div>
          </div>

          <div>
            <p className="mb-3 font-semibold text-white">Services</p>
            <ul className="space-y-2 text-sm">
              <li>Chip Repair</li>
              <li>Crack Repair</li>
              <li>Full Replacement</li>
              <li>ADAS Recalibration</li>
            </ul>
          </div>

          <div>
            <p className="mb-3 font-semibold text-white">Contact</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="hover:text-white transition-colors">
                  {PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:hello@quickfixglass.in" className="hover:text-white transition-colors">
                  hello@quickfixglass.in
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Mumbai • Delhi • Bengaluru • Chennai • Hyderabad • Pune</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          <p>© {new Date().getFullYear()} QuickFix Auto Glass. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

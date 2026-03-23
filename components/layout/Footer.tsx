import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 98765 43210";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white text-gray-600">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="mb-1 font-serif text-xl font-bold text-black">
              QuickFix <span className="font-normal">Windshields</span>
            </p>
            <p className="mb-4 text-sm leading-relaxed text-gray-500">
              Premium doorstep windshield repair and replacement. We come to you — at home, office, or wherever you are.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded border border-gray-200 px-2.5 py-1 text-xs text-gray-500">UPI</span>
              <span className="rounded border border-gray-200 px-2.5 py-1 text-xs text-gray-500">Credit / Debit Card</span>
              <span className="rounded border border-gray-200 px-2.5 py-1 text-xs text-gray-500">Cash</span>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-black">Services</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Chip Repair</li>
              <li>Crack Repair</li>
              <li>Full Replacement</li>
              <li>ADAS Recalibration</li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-black">Contact</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`tel:${PHONE.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {PHONE}
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@quickfixglass.in"
                  className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  hello@quickfixglass.in
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-500">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>Mumbai · Delhi · Bengaluru · Chennai · Hyderabad · Pune</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} QuickFix Windshields. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-black transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

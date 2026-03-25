import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MetaPixel } from "@/components/MetaPixel";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "QuickFix Windshields Bengaluru — Doorstep Windshield Repair & Replacement",
  description:
    "Premium doorstep windshield repair and replacement in Bengaluru. Certified technicians come to your home or office. OEM-grade glass, ADAS recalibration, 1-year warranty. Get a free quote in 60 seconds.",
  keywords: [
    "windshield repair Bengaluru",
    "windshield replacement Bengaluru",
    "car glass repair Bangalore",
    "doorstep auto glass service",
    "windshield replacement at home Bengaluru",
    "OEM windshield Bangalore",
  ],
  openGraph: {
    title: "QuickFix Windshields — Doorstep Service in Bengaluru",
    description:
      "Get your windshield repaired or replaced at your doorstep anywhere in Bengaluru. OEM glass, certified technicians, 1-year warranty.",
    type: "website",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "QuickFix Windshields",
  description:
    "Premium doorstep windshield repair and replacement in Bengaluru. Technicians come to your location.",
  url: process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.quickfixwindshields.co",
  telephone: process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 98765 43210",
  email: "hello@quickfixwindshields.co",
  areaServed: ["Bengaluru"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  priceRange: "₹₹₹",
  serviceType: ["Windshield Repair", "Windshield Replacement", "ADAS Recalibration"],
  paymentAccepted: ["Cash", "Credit Card", "UPI"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-screen bg-white font-sans antialiased">
        <MetaPixel />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

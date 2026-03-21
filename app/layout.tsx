import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MetaPixel } from "@/components/MetaPixel";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "QuickFix Auto Glass — Doorstep Windshield Repair & Replacement",
  description:
    "Premium mobile windshield repair and replacement service in Mumbai, Delhi, Bengaluru, Chennai, Hyderabad & Pune. Certified technicians come to your doorstep. Get a free quote in 60 seconds.",
  keywords: [
    "windshield repair",
    "windshield replacement",
    "auto glass",
    "doorstep car service",
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "car glass repair India",
  ],
  openGraph: {
    title: "QuickFix Auto Glass — Doorstep Windshield Service",
    description:
      "Get your windshield repaired or replaced at your doorstep. Serving Mumbai, Delhi, Bengaluru and more.",
    type: "website",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "QuickFix Auto Glass",
  description:
    "Premium mobile windshield repair and replacement service. Technicians come to your doorstep.",
  url: process.env.NEXT_PUBLIC_BASE_URL ?? "https://quickfixglass.in",
  telephone: process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 98765 43210",
  areaServed: ["Mumbai", "New Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune"],
  priceRange: "₹₹₹",
  serviceType: ["Windshield Repair", "Windshield Replacement", "ADAS Recalibration"],
  paymentAccepted: ["Cash", "Credit Card", "UPI"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
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

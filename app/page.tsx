import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { TrustSignals } from "@/components/sections/TrustSignals";
import { Testimonials } from "@/components/sections/Testimonials";
import { CoverageStrip } from "@/components/sections/CoverageStrip";

export const metadata: Metadata = {
  title: "QuickFix Auto Glass — Doorstep Windshield Repair & Replacement India",
  description:
    "Get your car windshield repaired or replaced at your doorstep across Mumbai, Delhi, Bengaluru, Chennai, Hyderabad and Pune. Free quote in 60 seconds. Certified technicians, OEM glass, 1-year warranty.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSignals />
      <Services />
      <HowItWorks />
      <Testimonials />
      <CoverageStrip />
    </>
  );
}

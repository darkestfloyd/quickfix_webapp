import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — QuickFix Windshields",
  description: "Terms of Service for QuickFix Windshields doorstep windshield repair and replacement service in Bengaluru.",
};

const LAST_UPDATED = "March 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 font-serif text-xl font-bold text-black">{title}</h2>
      <div className="space-y-3 text-gray-600 leading-relaxed">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
        {/* Header */}
        <div className="mb-10 border-b border-gray-100 pb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal-600">Legal</p>
          <h1 className="font-serif text-4xl font-bold text-black">Terms of Service</h1>
          <p className="mt-3 text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
        </div>

        <Section title="Acceptance of Terms">
          <p className="text-sm">
            By accessing our website at{" "}
            <a href="https://www.quickfixwindshields.co" className="text-black underline underline-offset-2">
              www.quickfixwindshields.co
            </a>{" "}
            or submitting a booking request, you agree to be bound by these Terms of Service.
            If you do not agree with any part of these terms, please do not use our services.
          </p>
          <p className="text-sm">
            These Terms apply to all visitors, users, and customers of QuickFix Windshields, a doorstep windshield
            repair and replacement service operating in Bengaluru, Karnataka, India.
          </p>
        </Section>

        <Section title="Service Description">
          <p className="text-sm">
            QuickFix Windshields provides mobile, doorstep windshield repair and replacement services. A certified
            technician travels to the customer&apos;s specified location (home, office, or other address) within Bengaluru
            to perform the requested service.
          </p>
          <p className="text-sm">
            Services offered include:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Chip and crack repair</li>
            <li>Front windshield replacement</li>
            <li>Rear and door glass replacement</li>
            <li>ADAS (Advanced Driver Assistance System) camera and sensor recalibration</li>
          </ul>
          <p className="text-sm">
            We currently serve all PIN codes in Bengaluru beginning with <strong className="text-black">560</strong>.
            Service availability in specific localities is subject to technician availability and may vary.
          </p>
        </Section>

        <Section title="Booking & Quotes">
          <p className="text-sm">
            Quotes provided through our website are <strong className="text-black">estimates</strong> based on your
            vehicle make, model, year, and glass type. The final price is confirmed by the technician upon arrival,
            after physically inspecting the vehicle. The final price will not exceed the quoted estimate unless
            additional damage is discovered during inspection that was not disclosed at time of booking, or unless
            you request additional services.
          </p>
          <p className="text-sm">
            A booking request does not constitute a confirmed appointment until you receive a confirmation call or
            message from our coordination team. We will contact you within 2 hours of submission to confirm details
            and finalise the appointment.
          </p>
        </Section>

        <Section title="Cancellation & Rescheduling">
          <p className="text-sm">
            You may cancel or reschedule your appointment at no charge by contacting us at least{" "}
            <strong className="text-black">2 hours before</strong> the scheduled service window, either by phone or
            WhatsApp.
          </p>
          <p className="text-sm">
            If a technician has already been dispatched and you are unavailable or cancel on arrival, a visit fee
            may be charged to cover travel costs. We will inform you of this fee in advance.
          </p>
        </Section>

        <Section title="Payment Terms">
          <p className="text-sm">
            Payment is due upon completion of the service. We accept:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>UPI (Google Pay, PhonePe, Paytm, BHIM, etc.)</li>
            <li>Credit and debit cards (collected via mobile POS at site)</li>
            <li>Cash</li>
          </ul>
          <p className="text-sm">
            No advance payment is required to confirm a booking. Prices are inclusive of OEM-grade glass,
            adhesive, labour, and doorstep service. GST is included in the quoted price where applicable.
          </p>
        </Section>

        <Section title="Warranty">
          <p className="text-sm">
            All glass replacements carried out by QuickFix Windshields are covered by a{" "}
            <strong className="text-black">1-year warranty</strong> against manufacturing defects and water leaks
            attributable to the installation.
          </p>
          <p className="text-sm">
            The warranty does not cover:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Damage caused by accidents, road debris, or external impact after installation.</li>
            <li>Chip or crack repairs that subsequently spread due to temperature changes or stress.</li>
            <li>Damage resulting from improper cleaning products or car wash equipment.</li>
          </ul>
          <p className="text-sm">
            To make a warranty claim, contact us at{" "}
            <a href="mailto:hello@quickfixwindshields.co" className="text-black underline underline-offset-2">
              hello@quickfixwindshields.co
            </a>{" "}
            with your booking reference number and a description of the issue.
          </p>
        </Section>

        <Section title="Pre-existing Damage">
          <p className="text-sm">
            Our technicians will conduct a visual inspection of your vehicle before beginning work. Any pre-existing
            damage to the vehicle that is unrelated to the glass being serviced will be noted and is not the
            responsibility of QuickFix Windshields. We are not liable for pre-existing damage discovered during
            or after the service.
          </p>
          <p className="text-sm">
            Customers are encouraged to photograph their vehicle before the service begins for their own records.
          </p>
        </Section>

        <Section title="Limitation of Liability">
          <p className="text-sm">
            To the fullest extent permitted by applicable law, QuickFix Windshields shall not be liable for any
            indirect, incidental, or consequential damages arising from the use of our services, including but not
            limited to loss of vehicle use, missed appointments, or consequential damages resulting from ADAS
            recalibration delays.
          </p>
          <p className="text-sm">
            Our total liability for any claim arising out of the provision of services shall not exceed the amount
            paid by you for the specific service in question.
          </p>
        </Section>

        <Section title="Glass Quality">
          <p className="text-sm">
            We use OEM (Original Equipment Manufacturer) grade glass or OEM-equivalent glass that meets the
            specifications of the original glass installed in your vehicle. Where OEM glass is available for your
            vehicle, we will use it; otherwise, we use certified aftermarket glass that meets Indian safety standards.
            We will inform you of the glass type to be used prior to commencing work.
          </p>
        </Section>

        <Section title="Intellectual Property">
          <p className="text-sm">
            All content on this website — including text, design, graphics, and code — is the property of
            QuickFix Windshields and may not be reproduced, distributed, or used without prior written permission.
          </p>
        </Section>

        <Section title="Amendments">
          <p className="text-sm">
            We reserve the right to update these Terms of Service at any time. Changes will be effective upon
            posting to this page with a revised &ldquo;Last updated&rdquo; date. Your continued use of our website or
            services after changes are posted constitutes acceptance of the updated terms.
          </p>
        </Section>

        <Section title="Governing Law & Dispute Resolution">
          <p className="text-sm">
            These Terms are governed by the laws of India. Any disputes arising in connection with these Terms
            or the services provided shall be subject to the exclusive jurisdiction of the courts of Bengaluru,
            Karnataka.
          </p>
          <p className="text-sm">
            We encourage you to contact us first at{" "}
            <a href="mailto:hello@quickfixwindshields.co" className="text-black underline underline-offset-2">
              hello@quickfixwindshields.co
            </a>{" "}
            to resolve any concern informally before pursuing formal legal action.
          </p>
        </Section>

        <Section title="Contact">
          <p className="text-sm">
            For questions about these Terms, please contact us at{" "}
            <a href="mailto:hello@quickfixwindshields.co" className="text-black underline underline-offset-2">
              hello@quickfixwindshields.co
            </a>.
          </p>
        </Section>

        <div className="mt-10 border-t border-gray-100 pt-6 text-xs text-gray-400">
          <Link href="/" className="hover:text-black transition-colors">← Back to Home</Link>
          {" · "}
          <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}

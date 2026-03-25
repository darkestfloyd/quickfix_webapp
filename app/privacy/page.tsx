import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — QuickFix Windshields",
  description: "Privacy Policy for QuickFix Windshields. Learn how we collect, use, and protect your personal information.",
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

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
        {/* Header */}
        <div className="mb-10 border-b border-gray-100 pb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal-600">Legal</p>
          <h1 className="font-serif text-4xl font-bold text-black">Privacy Policy</h1>
          <p className="mt-3 text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
        </div>

        <Section title="Who We Are">
          <p>
            QuickFix Windshields (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a doorstep windshield repair and
            replacement service. Our website is located at{" "}
            <a href="https://www.quickfixwindshields.co" className="text-black underline underline-offset-2">
              www.quickfixwindshields.co
            </a>{" "}
            and our primary contact email is{" "}
            <a href="mailto:hello@quickfixwindshields.co" className="text-black underline underline-offset-2">
              hello@quickfixwindshields.co
            </a>.
          </p>
          <p>
            This Privacy Policy explains what personal information we collect when you use our website or book a service,
            how we use it, and your rights regarding that information.
          </p>
        </Section>

        <Section title="Information We Collect">
          <p>When you use our website or submit a booking request, we may collect:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li><strong className="text-black">Contact details:</strong> Full name, mobile number, and email address (email is optional).</li>
            <li><strong className="text-black">Vehicle information:</strong> Make, model, year of manufacture, and glass type (front or rear).</li>
            <li><strong className="text-black">Service location:</strong> Full address and PIN code where you require service.</li>
            <li><strong className="text-black">Appointment details:</strong> Preferred date and time slot.</li>
            <li><strong className="text-black">Quote information:</strong> The price estimate we generated for your vehicle.</li>
            <li><strong className="text-black">Attribution data:</strong> UTM parameters (e.g. <code>utm_source</code>, <code>utm_campaign</code>), Facebook Click ID (<code>fbclid</code>), and HTTP referrer, when present in your browser URL at the time of booking. These are used to understand which advertising campaigns are effective.</li>
            <li><strong className="text-black">Session data:</strong> A randomly generated session identifier stored in your browser&apos;s session storage for the duration of your visit.</li>
          </ul>
          <p className="text-sm">
            We do not collect payment card details. All payments are made in person at the time of service.
          </p>
        </Section>

        <Section title="How We Use Your Information">
          <p>We use the information collected solely to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li>Contact you to confirm, schedule, and coordinate your service appointment.</li>
            <li>Dispatch a certified technician to your chosen location.</li>
            <li>Send your booking confirmation details (if you provided an email address).</li>
            <li>Measure the effectiveness of our advertising campaigns and improve our marketing.</li>
            <li>Improve our service quality and pricing based on aggregated, anonymised trends.</li>
          </ul>
          <p className="text-sm font-medium text-black">
            We do not sell, rent, or share your personal information with third parties for their marketing purposes.
          </p>
        </Section>

        <Section title="Meta Pixel & Analytics">
          <p className="text-sm">
            Our website uses the Meta Pixel (Facebook Pixel), a tracking technology provided by Meta Platforms, Inc.
            The pixel fires standard events (such as page views, quote views, and lead submissions) to help us measure
            the performance of our Facebook and Instagram advertising. This may involve the collection of anonymised
            browsing data by Meta on our behalf, subject to{" "}
            <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-black underline underline-offset-2">
              Meta&apos;s Privacy Policy
            </a>.
          </p>
          <p className="text-sm">
            We do not transmit your name, phone number, or address to Meta. Only aggregated event signals are sent.
          </p>
        </Section>

        <Section title="Cookies & Session Storage">
          <p className="text-sm">
            We do not set persistent cookies for tracking purposes. We use your browser&apos;s <strong>session storage</strong> to
            temporarily hold your booking progress (vehicle, address, appointment details) while you complete the booking
            form. This data is automatically cleared when you close the browser tab and never stored on our servers until
            you explicitly submit the booking form.
          </p>
          <p className="text-sm">
            Third-party scripts (Meta Pixel) may set their own cookies in accordance with their respective policies.
          </p>
        </Section>

        <Section title="Data Retention">
          <p className="text-sm">
            Booking records (lead requests) are retained in our database for <strong>12 months</strong> from the date
            of submission, after which they are deleted. Funnel event logs are retained for <strong>6 months</strong>.
          </p>
        </Section>

        <Section title="Your Rights">
          <p className="text-sm">You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li>Request a copy of the personal information we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your data from our systems.</li>
            <li>Withdraw consent for us to contact you for marketing purposes at any time.</li>
          </ul>
          <p className="text-sm">
            To exercise any of these rights, email us at{" "}
            <a href="mailto:hello@quickfixwindshields.co" className="text-black underline underline-offset-2">
              hello@quickfixwindshields.co
            </a>{" "}
            with the subject line &ldquo;Data Request&rdquo;. We will respond within 7 business days.
          </p>
        </Section>

        <Section title="Data Security">
          <p className="text-sm">
            Your data is stored on Neon (a managed PostgreSQL service) hosted in a secure cloud environment with
            encryption in transit (TLS) and at rest. Access to the database is restricted to authorised personnel only.
            We do not store sensitive financial information.
          </p>
        </Section>

        <Section title="Governing Law">
          <p className="text-sm">
            This Privacy Policy is governed by the laws of India, and any disputes shall be subject to the jurisdiction
            of the courts of Bengaluru, Karnataka.
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p className="text-sm">
            We may update this Privacy Policy from time to time. When we do, we will revise the &ldquo;Last updated&rdquo; date at
            the top of this page. We encourage you to review this page periodically.
          </p>
        </Section>

        <Section title="Contact Us">
          <p className="text-sm">
            For any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:hello@quickfixwindshields.co" className="text-black underline underline-offset-2">
              hello@quickfixwindshields.co
            </a>.
          </p>
        </Section>

        <div className="mt-10 border-t border-gray-100 pt-6 text-xs text-gray-400">
          <Link href="/" className="hover:text-black transition-colors">← Back to Home</Link>
          {" · "}
          <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}

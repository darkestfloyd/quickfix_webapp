import { Check, Shield, Clock, Star, Users, Award } from "lucide-react";

const FEATURES = [
  {
    title: "1-Year Bubble Free Warranty",
    description: "Every installation guaranteed bubble free for 1 year.",
  },
  {
    title: "Priority Doorstep Service",
    description: "We come to your home, office, or anywhere you want.",
  },
  {
    title: "Insurance Claims (Coming soon!)",
    description: "We work directly with most insurers. Zero paperwork, zero advance payment for covered repairs.",
  },
];

const BADGES = [
  { icon: Shield, label: "1-Year Warranty", sub: "On all glass" },
  { icon: Award, label: "OEM-Grade Glass", sub: "Factory-spec quality" },
  { icon: Clock, label: "90-Min Service", sub: "Fast, on-site completion" },
  { icon: Star, label: "4.9 / 5 Rating", sub: "Average customer rating" },
  { icon: Users, label: "Certified Techs", sub: "Background verified" },
  { icon: Check, label: "500+ Cars Served", sub: "Across Bengaluru" },
];

export function TrustSignals() {
  return (
    <section className="bg-gray-950 py-16 text-white sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-500">
          Our Standards
        </div>
        <h2 className="mb-12 text-3xl font-bold sm:text-4xl">
          Uncompromising Standards for the{" "}
          <em className="font-bold italic text-gray-400">Discerning Owner</em>
        </h2>

        {/* Feature list */}
        <div className="mb-14 grid gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500">
                <Check className="h-3 w-3 text-black" strokeWidth={3} />
              </div>
              <div>
                <p className="mb-1 font-semibold text-white">{f.title}</p>
                <p className="text-sm leading-relaxed text-gray-400">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Badge grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {BADGES.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.label}
                className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 p-4 text-center"
              >
                <div className="mb-2 rounded-lg bg-teal-500/10 p-2">
                  <Icon className="h-4 w-4 text-teal-500" />
                </div>
                <p className="text-xs font-semibold text-white">{b.label}</p>
                <p className="mt-0.5 text-xs text-gray-500">{b.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

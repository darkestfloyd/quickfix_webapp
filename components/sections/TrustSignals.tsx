import { Shield, Award, Clock, ThumbsUp, Users, Star } from "lucide-react";

const SIGNALS = [
  { icon: Shield, label: "1-Year Warranty", sub: "On all glass & labour" },
  { icon: Award, label: "OEM-Grade Glass", sub: "Factory-spec quality" },
  { icon: Clock, label: "90-Min Service", sub: "Fast, on-site completion" },
  { icon: ThumbsUp, label: "500+ Cars Served", sub: "Across 6 major cities" },
  { icon: Users, label: "Certified Technicians", sub: "Background verified" },
  { icon: Star, label: "4.9 / 5 Rating", sub: "Average customer rating" },
];

export function TrustSignals() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-navy-900 sm:text-4xl">
            Why Customers Choose Us
          </h2>
          <p className="text-muted-foreground">
            Premium service. Transparent pricing. Zero compromises.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SIGNALS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50 p-4 text-center"
              >
                <div className="mb-2 rounded-lg bg-amber-50 p-2">
                  <Icon className="h-5 w-5 text-amber-500" />
                </div>
                <p className="text-xs font-semibold text-navy-900">{s.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Zap, Car, Eye } from "lucide-react";

const SERVICES = [
  {
    icon: Zap,
    title: "Chip Repair",
    description: "Small chips and bullseye cracks repaired in under 30 minutes. Invisible results, prevents further spreading.",
    price: "From ₹1,500",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Wrench,
    title: "Crack Repair",
    description: "Long cracks up to 30cm repaired using advanced resin injection. Restores structural integrity.",
    price: "From ₹2,500",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Car,
    title: "Full Replacement",
    description: "Complete windshield replacement using OEM or OEM-equivalent glass. Includes adhesive and curing.",
    price: "From ₹3,500",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Eye,
    title: "ADAS Recalibration",
    description: "Camera and sensor recalibration after glass replacement. Essential for vehicles with lane assist, collision warning.",
    price: "From ₹4,000",
    color: "text-green-500",
    bg: "bg-green-50",
  },
];

export function Services() {
  return (
    <section id="services" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-navy-900 sm:text-4xl">
            What We Fix
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            From minor chips to full replacements — our mobile technicians handle it all at your location.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className={`mb-4 inline-flex rounded-xl p-3 ${service.bg}`}>
                    <Icon className={`h-6 w-6 ${service.color}`} />
                  </div>
                  <h3 className="mb-2 font-semibold text-navy-900">{service.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{service.description}</p>
                  <p className={`text-sm font-semibold ${service.color}`}>{service.price}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

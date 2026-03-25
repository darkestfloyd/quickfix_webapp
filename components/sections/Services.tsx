import { Wrench, Zap, Car, Eye } from "lucide-react";

const SERVICES = [
  {
    icon: Car,
    title: "Full Replacement",
    description: "Complete windshield replacement using OEM or OEM-equivalent glass. Includes adhesive and curing.",
  },
  {
    icon: Eye,
    title: "ADAS Recalibration",
    description: "Camera and sensor recalibration after glass replacement. Essential for lane assist and collision warning.",
  },
  {
    icon: Zap,
    title: "Chip Repair",
    description: "Small chips and bullseye cracks repaired in under 30 minutes. Invisible results, prevents further spreading.",
  },
  {
    icon: Wrench,
    title: "Crack Repair",
    description: "Long cracks up to 30cm repaired using advanced resin injection. Restores structural integrity.",
  },
];

export function Services() {
  return (
    <section id="services" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-600">
          What We Fix
        </div>
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-bold text-black sm:text-4xl">
            Every Glass Need,{" "}
            <em className="font-bold italic text-gray-400">Handled</em>
          </h2>
          <p className="max-w-sm text-sm text-gray-500">
            From minor chips to full replacements — our technicians handle it all at your location.
          </p>
        </div>

        <div className="grid gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group flex flex-col bg-white p-6 transition-colors hover:bg-stone-50"
              >
                <div className="mb-4 inline-flex rounded-lg border border-gray-100 bg-teal-50 p-2.5">
                  <Icon className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="mb-2 font-bold text-black">{service.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

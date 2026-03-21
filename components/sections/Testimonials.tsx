import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    city: "Mumbai",
    car: "Hyundai Creta",
    rating: 5,
    text: "Cracked my windshield on the highway. Booked QuickFix that evening, technician arrived at my office parking the next morning. Done in 80 minutes. Absolute lifesaver.",
  },
  {
    name: "Priya Menon",
    city: "Bengaluru",
    car: "Toyota Fortuner",
    rating: 5,
    text: "I was worried about ADAS recalibration for my Fortuner. The technician knew exactly what to do — sensors were calibrated and verified on-site. Very professional service.",
  },
  {
    name: "Arjun Kapoor",
    city: "Delhi",
    car: "Maruti Baleno",
    rating: 5,
    text: "Price was better than the dealer and the glass quality is identical. They came to my home on a Saturday morning. 5 stars, would definitely recommend.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-navy-900 sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground">Real reviews from car owners across India</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <Stars count={t.rating} />
                <p className="mt-4 text-sm leading-relaxed text-gray-700">"{t.text}"</p>
                <div className="mt-4 border-t pt-4">
                  <p className="font-semibold text-navy-900 text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.city} · {t.car}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

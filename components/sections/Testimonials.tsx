import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Rajesh K.",
    title: "Tech Executive, Bengaluru",
    car: "BMW 5 Series",
    rating: 5,
    text: "Had a crack appear on my way to a board meeting. Booked QuickFix from my phone and the technician was at my office parking by 9 AM the next day. Flawless execution.",
  },
  {
    name: "Priya M.",
    title: "Corporate Director, Mumbai",
    car: "Toyota Fortuner",
    rating: 5,
    text: "The ADAS recalibration after replacement was handled entirely on-site. I was impressed — the technician verified every sensor before leaving. Worth every rupee.",
  },
  {
    name: "Anand S.",
    title: "VP of Operations, Delhi",
    car: "Hyundai Tucson",
    rating: 5,
    text: "Transparent pricing, no surprises, and they worked with my insurer directly. The whole experience felt like a premium concierge service, not a repair job.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-teal-500 text-teal-500" />
      ))}
    </div>
  );
}

function Initials({ name }: { name: string }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
      {name.split(" ").map((n) => n[0]).join("")}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-600">
          The Guest Journal
        </div>
        <h2 className="mb-12 text-3xl font-bold text-black sm:text-4xl">
          Trusted by{" "}
          <em className="font-bold italic text-gray-400">India&apos;s Executives</em>
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between rounded-xl border border-gray-100 bg-stone-50 p-6"
            >
              <div>
                <Stars count={t.rating} />
                <p className="mt-4 text-sm leading-relaxed text-gray-700">&ldquo;{t.text}&rdquo;</p>
              </div>
              <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                <Initials name={t.name} />
                <div>
                  <p className="text-sm font-semibold text-black">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.car}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

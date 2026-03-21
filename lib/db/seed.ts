/**
 * Seed script — run with: pnpm db:seed
 *
 * Safe to re-run: uses onConflictDoNothing() on all inserts.
 *
 * To add vehicles:  append to VEHICLES array below
 * To add PIN codes: append to PIN_CODES array below
 * To extend slots:  increase the loop limit in generateSlots()
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { vehiclePricing, pricingMarkup, servicePinCoverage, availabilitySlots } from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// --- ADD NEW VEHICLES HERE ---
// basePrice is the cost before markup. currentPrice = basePrice * (1 + markup/100)
// Markup is defined in MARKUP_PERCENTAGE below (currently 15%)
const VEHICLES = [
  // Maruti Suzuki
  { year: 2024, make: "Maruti Suzuki", model: "Swift", basePrice: 3800 },
  { year: 2024, make: "Maruti Suzuki", model: "Baleno", basePrice: 4000 },
  { year: 2024, make: "Maruti Suzuki", model: "Ertiga", basePrice: 4500 },
  { year: 2024, make: "Maruti Suzuki", model: "Brezza", basePrice: 4800 },
  { year: 2024, make: "Maruti Suzuki", model: "Dzire", basePrice: 3800 },
  // Hyundai
  { year: 2024, make: "Hyundai", model: "i20", basePrice: 4200 },
  { year: 2024, make: "Hyundai", model: "Creta", basePrice: 6500 },
  { year: 2024, make: "Hyundai", model: "Verna", basePrice: 5800 },
  { year: 2024, make: "Hyundai", model: "Tucson", basePrice: 9000 },
  // Tata
  { year: 2024, make: "Tata", model: "Nexon", basePrice: 5500 },
  { year: 2024, make: "Tata", model: "Harrier", basePrice: 8500 },
  { year: 2024, make: "Tata", model: "Punch", basePrice: 4200 },
  // Honda
  { year: 2024, make: "Honda", model: "City", basePrice: 5500 },
  { year: 2024, make: "Honda", model: "Amaze", basePrice: 4500 },
  // Toyota
  { year: 2024, make: "Toyota", model: "Fortuner", basePrice: 14000 },
  { year: 2024, make: "Toyota", model: "Innova Crysta", basePrice: 9500 },
  { year: 2024, make: "Toyota", model: "Hyryder", basePrice: 7500 },
  // Mahindra
  { year: 2024, make: "Mahindra", model: "Scorpio-N", basePrice: 8000 },
  { year: 2024, make: "Mahindra", model: "XUV700", basePrice: 10000 },
  { year: 2024, make: "Mahindra", model: "Thar", basePrice: 7000 },
];

// Applied to all vehicles: currentPrice = basePrice * (1 + MARKUP_PERCENTAGE/100)
// Change this value and re-seed to globally adjust prices
const MARKUP_PERCENTAGE = 15; // 15%

// --- ADD NEW SERVICE AREAS HERE ---
// surcharge (INR) is added on top of the vehicle quote for harder-to-reach areas
const PIN_CODES = [
  { pinCode: "400001", city: "Mumbai", state: "Maharashtra", surcharge: 0 },
  { pinCode: "400070", city: "Mumbai", state: "Maharashtra", surcharge: 0 },
  { pinCode: "400601", city: "Mumbai", state: "Maharashtra", surcharge: 500 },
  { pinCode: "110001", city: "New Delhi", state: "Delhi", surcharge: 0 },
  { pinCode: "110019", city: "New Delhi", state: "Delhi", surcharge: 0 },
  { pinCode: "110092", city: "Delhi", state: "Delhi", surcharge: 0 },
  { pinCode: "560001", city: "Bengaluru", state: "Karnataka", surcharge: 0 },
  { pinCode: "560034", city: "Bengaluru", state: "Karnataka", surcharge: 0 },
  { pinCode: "560066", city: "Bengaluru", state: "Karnataka", surcharge: 500 },
  { pinCode: "600001", city: "Chennai", state: "Tamil Nadu", surcharge: 0 },
  { pinCode: "500001", city: "Hyderabad", state: "Telangana", surcharge: 0 },
  { pinCode: "411001", city: "Pune", state: "Maharashtra", surcharge: 0 },
];

// Generates Mon–Sat slots for the next N days, 8am–6pm in 2-hour windows
// To change hours: edit startHours array below
// To change slot duration: edit both startHours and slotEndTime calculation
// To extend coverage: change the loop limit (currently 30 days)
function generateSlots() {
  const slots: { slotDate: string; slotTime: string; slotEndTime: string }[] = [];
  const today = new Date();

  for (let d = 1; d <= 30; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    // Skip Sundays (0)
    if (date.getDay() === 0) continue;

    const dateStr = date.toISOString().split("T")[0];
    // 8am–6pm, 2-hour slots: 08:00, 10:00, 12:00, 14:00, 16:00
    const startHours = [8, 10, 12, 14, 16];
    for (const hour of startHours) {
      slots.push({
        slotDate: dateStr,
        slotTime: `${String(hour).padStart(2, "0")}:00:00`,
        slotEndTime: `${String(hour + 2).padStart(2, "0")}:00:00`,
      });
    }
  }
  return slots;
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL not set");

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  console.log("Seeding vehicle pricing...");
  const vehicleRows = VEHICLES.map((v) => {
    const markup = Math.round(v.basePrice * (MARKUP_PERCENTAGE / 100));
    return {
      year: v.year,
      make: v.make,
      model: v.model,
      basePrice: String(v.basePrice),
      currentPrice: String(v.basePrice + markup),
    };
  });
  await db.insert(vehiclePricing).values(vehicleRows).onConflictDoNothing();

  console.log("Seeding pricing markup...");
  await db
    .insert(pricingMarkup)
    .values([{ label: "Standard markup", markupType: "percentage", value: "15", isActive: true }])
    .onConflictDoNothing();

  console.log("Seeding PIN codes...");
  await db
    .insert(servicePinCoverage)
    .values(
      PIN_CODES.map((p) => ({
        pinCode: p.pinCode,
        city: p.city,
        state: p.state,
        isActive: true,
        surcharge: String(p.surcharge),
      }))
    )
    .onConflictDoNothing();

  console.log("Seeding availability slots (next 30 days)...");
  const slots = generateSlots();
  // Insert in batches of 50
  for (let i = 0; i < slots.length; i += 50) {
    await db.insert(availabilitySlots).values(slots.slice(i, i + 50)).onConflictDoNothing();
  }

  console.log(`Seeded: ${vehicleRows.length} vehicles, ${PIN_CODES.length} PIN codes, ${slots.length} slots.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

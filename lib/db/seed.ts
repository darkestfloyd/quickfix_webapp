/**
 * Seed script — run with: pnpm db:seed
 *
 * Safe to re-run: uses onConflictDoNothing() on all inserts.
 *
 * Vehicle data is loaded from lib/db/car_list_india.csv (Make, Model, Category).
 * Base prices are assigned by category tier — see getBasePrice() below.
 * To extend slots: increase the loop limit in generateSlots()
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { vehiclePricing, pricingMarkup, servicePinCoverage, availabilitySlots } from "./schema";
import { istDateStr } from "../utils";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Applied to all vehicles: currentPrice = basePrice * (1 + MARKUP_PERCENTAGE/100)
const MARKUP_PERCENTAGE = 15; // 15%

// Assign base windshield replacement price by vehicle category
function getBasePrice(category: string): number {
  const cat = category.toLowerCase();
  if (cat.includes("ultra-luxury") || cat.includes("supercar") || cat.includes("hypercar")) return 18000;
  if (cat.includes("luxury") || cat.includes("grand tourer")) return 12000;
  if (cat.includes("performance")) return 10000;
  if (cat.includes("premium") || cat.includes("electric")) return 8500;
  if (cat.includes("compact") || cat.includes("hatchback") || cat.includes("micro") || cat.includes("mini")) return 3800;
  return 5500; // default: mid-range (sedan, suv, mpv, crossover, van, pickup, etc.)
}

async function loadVehiclesFromCSV(): Promise<{ make: string; model: string; vehicleCategory: string; basePrice: number }[]> {
  const csvPath = path.join(process.cwd(), "lib/db/car_list_india.csv");
  const vehicles: { make: string; model: string; vehicleCategory: string; basePrice: number }[] = [];

  const rl = readline.createInterface({
    input: fs.createReadStream(csvPath),
    crlfDelay: Infinity,
  });

  let isHeader = true;
  for await (const line of rl) {
    if (isHeader) { isHeader = false; continue; }
    const parts = line.split(",");
    if (parts.length < 3) continue;
    const make = parts[0].trim();
    const model = parts[1].trim();
    const category = parts.slice(2).join(",").trim(); // handle commas in category
    if (!make || !model) continue;
    vehicles.push({ make, model, vehicleCategory: category, basePrice: getBasePrice(category) });
  }

  return vehicles;
}

// --- ADD NEW SERVICE AREAS HERE ---
// surcharge (INR) is added on top of the vehicle quote for harder-to-reach areas
// Bengaluru-only launch. Any 560xxx PIN is covered by default (API fallback).
// Add specific entries here only when a surcharge applies for outer areas.
const PIN_CODES = [
  { pinCode: "560001", city: "Bengaluru", state: "Karnataka", surcharge: 0 },
  { pinCode: "560034", city: "Bengaluru", state: "Karnataka", surcharge: 0 },
  { pinCode: "560066", city: "Bengaluru", state: "Karnataka", surcharge: 500 },
  { pinCode: "560100", city: "Bengaluru", state: "Karnataka", surcharge: 500 },
];

// Generates Mon–Sat slots for the next 30 days — 3 fixed windows per day:
//   09:00–12:00  |  12:00–14:00  |  14:00–17:00
// To extend coverage: change the loop limit below (currently 30 days)
const FIXED_SLOTS = [
  { start: "09:00:00", end: "12:00:00" },
  { start: "12:00:00", end: "14:00:00" },
  { start: "14:00:00", end: "17:00:00" },
];

function generateSlots() {
  const slots: { slotDate: string; slotTime: string; slotEndTime: string; maxBookings: number }[] = [];
  const today = new Date();

  for (let d = 1; d <= 30; d++) {
    // Add d days in milliseconds; use istDateStr to format in IST
    const date = new Date(today.getTime() + d * 86_400_000);
    const dateStr = istDateStr(date);
    // Skip Sundays in IST
    const dow = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "short" }).format(date);
    if (dow === "Sun") continue;
    for (const slot of FIXED_SLOTS) {
      slots.push({
        slotDate: dateStr,
        slotTime: slot.start,
        slotEndTime: slot.end,
        maxBookings: 1,
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

  console.log("Loading vehicles from CSV...");
  const csvVehicles = await loadVehiclesFromCSV();
  console.log(`Loaded ${csvVehicles.length} vehicles from car_list_india.csv`);

  console.log("Seeding vehicle pricing...");
  const vehicleRows = csvVehicles.map((v) => {
    const markup = Math.round(v.basePrice * (MARKUP_PERCENTAGE / 100));
    return {
      make: v.make,
      model: v.model,
      vehicleCategory: v.vehicleCategory,
      basePrice: String(v.basePrice),
      currentPrice: String(v.basePrice + markup),
    };
  });
  // Insert in batches of 50
  for (let i = 0; i < vehicleRows.length; i += 50) {
    await db.insert(vehiclePricing).values(vehicleRows.slice(i, i + 50)).onConflictDoNothing();
  }

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
    await db.insert(availabilitySlots).values(
      slots.slice(i, i + 50).map((s) => ({ ...s, maxBookings: s.maxBookings }))
    ).onConflictDoNothing();
  }

  console.log(`Seeded: ${vehicleRows.length} vehicles, ${PIN_CODES.length} PIN codes, ${slots.length} slots.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

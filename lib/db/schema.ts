/**
 * Database schema — all tables defined here using Drizzle ORM.
 *
 * After any change to this file, run:
 *   pnpm db:generate   ← creates a migration file in drizzle/
 *   pnpm db:migrate    ← applies it to Neon
 *
 * Tables:
 *   vehicle_pricing       — make/model/year → base + current price (INR)
 *   pricing_markup        — global markup rules (currently 15% on all vehicles)
 *   service_pin_coverage  — which 6-digit PIN codes we serve
 *   availability_slots    — 2-hour appointment windows (Mon–Sat, seeded for next 30 days)
 *   lead_requests         — one row per submitted booking
 *   lead_events           — funnel step events (step_complete, lead_submit, etc.)
 */
import {
  pgTable,
  serial,
  integer,
  varchar,
  numeric,
  boolean,
  text,
  date,
  time,
  timestamp,
  uuid,
  jsonb,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const markupTypeEnum = pgEnum("markup_type", ["percentage", "flat"]);
export const leadStatusEnum = pgEnum("lead_status", ["pending", "confirmed", "cancelled"]);

export const vehiclePricing = pgTable(
  "vehicle_pricing",
  {
    id: serial("id").primaryKey(),
    year: integer("year").notNull(),
    make: varchar("make", { length: 100 }).notNull(),
    model: varchar("model", { length: 100 }).notNull(),
    basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
    currentPrice: numeric("current_price", { precision: 10, scale: 2 }).notNull(),
  },
  (t) => [uniqueIndex("vehicle_pricing_year_make_model_idx").on(t.year, t.make, t.model)]
);

export const pricingMarkup = pgTable("pricing_markup", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 100 }).notNull(),
  markupType: markupTypeEnum("markup_type").notNull(),
  value: numeric("value", { precision: 6, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const servicePinCoverage = pgTable("service_pin_coverage", {
  id: serial("id").primaryKey(),
  pinCode: varchar("pin_code", { length: 6 }).notNull().unique(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  surcharge: numeric("surcharge", { precision: 8, scale: 2 }).default("0").notNull(),
});

export const availabilitySlots = pgTable("availability_slots", {
  id: serial("id").primaryKey(),
  slotDate: date("slot_date").notNull(),
  slotTime: time("slot_time").notNull(),
  slotEndTime: time("slot_end_time").notNull(),
  maxBookings: integer("max_bookings").default(2).notNull(),
  bookedCount: integer("booked_count").default(0).notNull(),
});

export const leadRequests = pgTable("lead_requests", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleYear: integer("vehicle_year").notNull(),
  vehicleMake: varchar("vehicle_make", { length: 100 }).notNull(),
  vehicleModel: varchar("vehicle_model", { length: 100 }).notNull(),
  quoteAmount: numeric("quote_amount", { precision: 10, scale: 2 }).notNull(),
  servicePin: varchar("service_pin", { length: 6 }).notNull(),
  serviceCity: varchar("service_city", { length: 100 }).notNull(),
  serviceAddress: text("service_address").notNull(),
  appointmentDate: date("appointment_date").notNull(),
  appointmentTime: time("appointment_time").notNull(),
  slotId: integer("slot_id"),
  customerName: varchar("customer_name", { length: 200 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 15 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }),
  utmSource: varchar("utm_source", { length: 100 }),
  utmMedium: varchar("utm_medium", { length: 100 }),
  utmCampaign: varchar("utm_campaign", { length: 200 }),
  utmContent: varchar("utm_content", { length: 200 }),
  fbclid: varchar("fbclid", { length: 255 }),
  referrer: text("referrer"),
  sessionId: varchar("session_id", { length: 64 }),
  status: leadStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leadEvents = pgTable("lead_events", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id", { length: 64 }).notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  step: integer("step"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

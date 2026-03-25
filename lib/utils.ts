import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateSessionId(): string {
  return `qs_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// IST date utilities — hardcoded to Asia/Kolkata (UTC+5:30, no DST)
// Use these everywhere dates are computed to ensure consistency between
// local dev (Mac in IST) and Vercel production (UTC).
const IST_TZ = "Asia/Kolkata";

/** Format a Date object as YYYY-MM-DD in IST */
export function istDateStr(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: IST_TZ }).format(date);
}

/** Today's date string in IST */
export function istToday(): string {
  return istDateStr(new Date());
}

/** Tomorrow's date string in IST */
export function istTomorrow(): string {
  // Adding 24h works correctly for IST since India has no DST
  return istDateStr(new Date(Date.now() + 86_400_000));
}

/** Returns the next `count` Mon–Sat dates in IST starting from a YYYY-MM-DD string */
export function nextISTWeekdays(fromDateStr: string, count: number): string[] {
  const result: string[] = [];
  const [y, m, d] = fromDateStr.split("-").map(Number);
  // Use UTC midnight as arithmetic base; istDateStr() converts back to IST
  let ms = Date.UTC(y, m - 1, d);
  while (result.length < count) {
    const date = new Date(ms);
    const dow = new Intl.DateTimeFormat("en-US", { timeZone: IST_TZ, weekday: "short" }).format(date);
    if (dow !== "Sun") result.push(istDateStr(date));
    ms += 86_400_000;
  }
  return result;
}

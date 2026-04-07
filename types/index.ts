export interface VehiclePricing {
  id: number;
  make: string;
  model: string;
  vehicleCategory: string | null;
  basePrice: string;
  currentPrice: string;
}

export interface QuoteResponse {
  quote: number;
  currency: "INR";
  label: string;
  breakdown: {
    basePrice: number;
    markup: number;
    total: number;
  };
}

export interface AvailabilitySlot {
  id: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  endTime: string; // HH:MM:SS
  label: string; // "9:00 AM – 12:00 PM"
  available: boolean; // false = fully booked, render greyed out
}

export interface LeadRequest {
  // Step 1
  vehicleYear: number;
  vehicleMake: string;
  vehicleModel: string;
  quoteAmount?: number;
  // Step 2 (optional — no longer collected in funnel)
  servicePin?: string;
  serviceCity?: string;
  serviceAddress?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  slotId?: number;
  // Step 3 (now Step 2)
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  // Attribution
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  fbclid?: string;
  referrer?: string;
  sessionId?: string;
}

export interface LeadResponse {
  success: boolean;
  referenceId: string;
}

export interface AttributionData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  fbclid?: string;
  referrer?: string;
  sessionId?: string;
}

// Booking form state
export interface BookingState {
  step: 1 | 2 | 3;
  // Step 1: Car Details
  vehicleYear?: number;
  vehicleMake?: string;
  vehicleModel?: string;
  glassType?: "front" | "rear";
  // Step 2: Contact Info
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  // Step 3: Confirmation
  referenceId?: string;
}

export interface ServicePin {
  id: number;
  pinCode: string;
  city: string;
  state: string;
  isActive: boolean;
  surcharge: string;
}

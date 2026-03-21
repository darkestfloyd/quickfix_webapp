export interface VehiclePricing {
  id: number;
  year: number;
  make: string;
  model: string;
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
  time: string; // HH:MM
  endTime: string; // HH:MM
  label: string; // "9:00 AM – 11:00 AM"
}

export interface LeadRequest {
  // Step 1
  vehicleYear: number;
  vehicleMake: string;
  vehicleModel: string;
  quoteAmount: number;
  // Step 2
  servicePin: string;
  serviceCity: string;
  serviceAddress: string;
  appointmentDate: string;
  appointmentTime: string;
  slotId: number;
  // Step 3
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
  step: 1 | 2 | 3 | 4;
  // Step 1
  vehicleYear?: number;
  vehicleMake?: string;
  vehicleModel?: string;
  quoteAmount?: number;
  // Step 2
  servicePin?: string;
  serviceCity?: string;
  serviceAddress?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  slotId?: number;
  pinCovered?: boolean;
  // Step 3
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  // Confirmation
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

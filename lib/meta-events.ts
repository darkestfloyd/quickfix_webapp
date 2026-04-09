declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function fbq(event: string, name: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(event, name, params);
  }
}

export function trackPageView() {
  fbq("track", "PageView");
}

export function trackCTAClick() {
  fbq("track", "InitiateCheckout", { content_name: "CTA Click - Get Free Quote" });
}

export function trackStepComplete(step: number, stepName: string) {
  fbq("trackCustom", "BookingStepComplete", { step, stepName });
}

export function trackLeadSubmit(eventId: string) {
  fbq("track", "Lead", {
    content_name: "Booking Submitted",
    eventID: eventId,
  });
}

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
  fbq("track", "Lead", { content_name: "CTA Click - Get Free Quote" });
}

export function trackQuoteView(quoteAmount: number) {
  fbq("track", "ViewContent", {
    content_name: "Quote View",
    currency: "INR",
    value: quoteAmount,
  });
}

export function trackStepComplete(step: number, stepName: string) {
  fbq("trackCustom", "BookingStepComplete", { step, stepName });
}

export function trackLeadSubmit(quoteAmount: number) {
  fbq("track", "Lead", {
    content_name: "Booking Submitted",
    currency: "INR",
    value: quoteAmount,
  });
}

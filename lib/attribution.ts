import type { AttributionData } from "@/types";

const STORAGE_KEY = "qf_attribution";

export function captureAttribution(searchParams: URLSearchParams): AttributionData {
  const data: AttributionData = {
    utmSource: searchParams.get("utm_source") ?? undefined,
    utmMedium: searchParams.get("utm_medium") ?? undefined,
    utmCampaign: searchParams.get("utm_campaign") ?? undefined,
    utmContent: searchParams.get("utm_content") ?? undefined,
    fbclid: searchParams.get("fbclid") ?? undefined,
    referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
  };
  // Only store if we have at least one UTM param or fbclid
  const hasData = Object.values(data).some(Boolean);
  if (hasData && typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  return data;
}

export function getStoredAttribution(): AttributionData {
  if (typeof sessionStorage === "undefined") return {};
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AttributionData) : {};
  } catch {
    return {};
  }
}

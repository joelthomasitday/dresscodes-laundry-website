// Phone number constants for single source of truth
export const PHONE_DISPLAY = "+91 8943 437 272";
export const PHONE_E164 = "+918943437272";
export const PHONE_RAW = "918943437272";

/**
 * Returns the tel: href for phone calls
 */
export function getTelHref(): string {
  return `tel:${PHONE_E164}`;
}

/**
 * Returns the WhatsApp href with optional message
 */
export function getWhatsAppHref(message?: string): string {
  const baseUrl = `https://wa.me/${PHONE_RAW}`;
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
  return baseUrl;
}

import { siteSettings } from "@/content/site-settings";
import type { ContactInfo } from "@/content/types";

export type { ContactInfo };

/** Phone / email / WhatsApp details — edit them in src/content/site-settings.ts. */
export const contactInfo: ContactInfo = siteSettings.contact;

export function getTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function getMailtoHref(email: string): string {
  return `mailto:${email}`;
}

export function getWhatsAppHref(
  contact: ContactInfo = contactInfo,
  message: string = contact.whatsappMessage,
): string {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

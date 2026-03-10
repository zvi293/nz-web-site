import { fetchSiteSettings, useContactInfo, type ContactInfo } from "@/lib/site-settings-api";

export function getContactInfo(): ContactInfo {
  return fetchSiteSettings().contact;
}

export { useContactInfo };

export function getTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function getMailtoHref(email: string): string {
  return `mailto:${email}`;
}

export function getWhatsAppHref(
  contact: ContactInfo = getContactInfo(),
  message: string = contact.whatsappMessage,
): string {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

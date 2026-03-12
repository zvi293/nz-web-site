import { formatRepositoryError } from "@/lib/repository-error";
import { getSupabaseClient } from "@/lib/supabase";

export interface ContactEmailPayload {
  leadId: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  subject: string;
  sendMethod: "email";
  createdAt: string;
  formStartedAt: string;
  submittedAt: string;
  honeypot?: string;
}

export class ContactEmailDeliveryError extends Error {
  constructor(message: string) {
    super(`Contact email delivery failed: ${message}`);
    this.name = "ContactEmailDeliveryError";
  }
}

async function formatContactEmailError(error: unknown): Promise<string> {
  if (typeof error === "object" && error !== null && "context" in error && error.context instanceof Response) {
    const response = error.context.clone();

    try {
      const body = (await response.json()) as Record<string, unknown>;
      const details: string[] = [];

      if (typeof body.message === "string") details.push(body.message);
      if (typeof body.code === "string") details.push(`code: ${body.code}`);
      if (typeof body.details === "string") details.push(`details: ${body.details}`);
      if (typeof body.hint === "string") details.push(`hint: ${body.hint}`);
      if (details.length > 0) {
        return details.join(" | ");
      }
    } catch {
      try {
        const text = await response.text();
        if (text.trim().length > 0) {
          return text;
        }
      } catch {
        // Fall through to generic formatting.
      }
    }
  }

  return formatRepositoryError(error);
}

export async function sendContactEmailNotification(payload: ContactEmailPayload): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.functions.invoke("send-contact-email", {
      body: payload,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    throw new ContactEmailDeliveryError(await formatContactEmailError(error));
  }
}

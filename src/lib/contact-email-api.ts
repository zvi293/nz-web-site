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
}

export class ContactEmailDeliveryError extends Error {
  constructor(message: string) {
    super(`Contact email delivery failed: ${message}`);
    this.name = "ContactEmailDeliveryError";
  }
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
    throw new ContactEmailDeliveryError(formatRepositoryError(error));
  }
}

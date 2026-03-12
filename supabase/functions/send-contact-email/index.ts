const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ContactEmailPayload = {
  leadId: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  subject: string;
  sendMethod: "email";
  createdAt: string;
};

type JsonRecord = Record<string, unknown>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const displayEmailPattern = /^(?:.+<)?([^<>@\s]+@[^<>@\s]+\.[^<>@\s]+)>?$/;

function jsonResponse(status: number, body: JsonRecord) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string): boolean {
  return emailPattern.test(value);
}

function extractEmailAddress(value: string): string | null {
  const trimmed = value.trim();
  if (isValidEmail(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(displayEmailPattern);
  if (!match) {
    return null;
  }

  return isValidEmail(match[1]) ? match[1] : null;
}

function parsePayload(payload: unknown): ContactEmailPayload | null {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const candidate = payload as Partial<ContactEmailPayload>;

  if (
    !isNonEmptyString(candidate.leadId) ||
    !isNonEmptyString(candidate.name) ||
    !isNonEmptyString(candidate.email) ||
    !isNonEmptyString(candidate.phone) ||
    !isNonEmptyString(candidate.subject) ||
    !isNonEmptyString(candidate.createdAt) ||
    candidate.sendMethod !== "email"
  ) {
    return null;
  }

  const email = candidate.email.trim();

  if (!isValidEmail(email)) {
    return null;
  }

  return {
    leadId: candidate.leadId.trim(),
    name: candidate.name.trim(),
    email,
    phone: candidate.phone.trim(),
    companyName: isNonEmptyString(candidate.companyName) ? candidate.companyName.trim() : undefined,
    subject: candidate.subject.trim(),
    sendMethod: "email",
    createdAt: candidate.createdAt.trim(),
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatTimestamp(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jerusalem",
  }).format(date);
}

function buildFieldRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:12px 14px;font-weight:700;border-bottom:1px solid #e5e7eb;white-space:nowrap;color:#0f172a;">${escapeHtml(label)}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #e5e7eb;color:#334155;">${escapeHtml(value)}</td>
    </tr>`;
}

function buildReplyLink(email: string, subject: string): string {
  const replySubject = encodeURIComponent(`Re: ${subject}`);
  return `mailto:${encodeURIComponent(email)}?subject=${replySubject}`;
}

function buildHtmlEmail(payload: ContactEmailPayload): string {
  const createdAt = formatTimestamp(payload.createdAt);
  const companyName = payload.companyName ?? "לא נמסר";
  const replyLink = buildReplyLink(payload.email, payload.subject);

  const detailRows = [
    buildFieldRow("שם מלא", payload.name),
    buildFieldRow("אימייל", payload.email),
    buildFieldRow("טלפון", payload.phone),
    buildFieldRow("שם חברה / עסק", companyName),
    buildFieldRow("אופן פנייה", "אימייל"),
    buildFieldRow("נשלח בתאריך", createdAt),
    buildFieldRow("Lead ID", payload.leadId),
  ].join("");

  return `
    <div dir="rtl" style="margin:0;background:#f8fafc;padding:32px 16px;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#0f172a 0%,#2563eb 100%);padding:28px 24px;color:#ffffff;">
          <div style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.8;">NZ WEB</div>
          <h1 style="margin:10px 0 8px;font-size:28px;line-height:1.2;">פניית צור קשר חדשה</h1>
          <p style="margin:0;font-size:15px;line-height:1.7;opacity:0.9;">התקבלה פנייה חדשה מטופס יצירת הקשר באתר ומומלץ לטפל בה בהקדם.</p>
        </div>

        <div style="padding:24px;">
          <div style="margin-bottom:20px;border:1px solid #dbeafe;background:#eff6ff;border-radius:16px;padding:18px;">
            <div style="font-size:12px;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:0.08em;">נושא הפנייה</div>
            <div style="margin-top:8px;font-size:22px;font-weight:700;line-height:1.5;color:#0f172a;">${escapeHtml(payload.subject)}</div>
          </div>

          <div style="margin-bottom:20px;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
            <table style="width:100%;border-collapse:collapse;font-size:15px;">
              <tbody>${detailRows}</tbody>
            </table>
          </div>

          <div style="margin-bottom:20px;border:1px solid #e2e8f0;border-radius:16px;padding:20px;background:#f8fafc;">
            <div style="margin-bottom:10px;font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.08em;">תוכן הפנייה</div>
            <div style="font-size:16px;line-height:1.9;color:#0f172a;white-space:pre-wrap;">${escapeHtml(payload.subject)}</div>
          </div>

          <div style="margin-top:24px;text-align:center;">
            <a href="${replyLink}" style="display:inline-block;border-radius:999px;background:#2563eb;padding:14px 24px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">
              השב ללקוח
            </a>
            <div style="margin-top:10px;font-size:13px;color:#64748b;">
              לחיצה על הכפתור תפתח reply ישיר אל ${escapeHtml(payload.email)}
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function buildTextEmail(payload: ContactEmailPayload): string {
  return [
    "פניית צור קשר חדשה",
    "",
    `שם מלא: ${payload.name}`,
    `אימייל: ${payload.email}`,
    `טלפון: ${payload.phone}`,
    `שם חברה / עסק: ${payload.companyName ?? "לא נמסר"}`,
    `נושא הפנייה: ${payload.subject}`,
    `תוכן הפנייה: ${payload.subject}`,
    "אופן פנייה: אימייל",
    `נשלח בתאריך: ${formatTimestamp(payload.createdAt)}`,
    `Lead ID: ${payload.leadId}`,
    "",
    `Reply ישיר: ${payload.email}`,
  ].join("\n");
}

Deno.serve(async (request) => {
  try {
    if (request.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return jsonResponse(405, {
        message: "Method not allowed",
        code: "METHOD_NOT_ALLOWED",
        hint: "Use POST when invoking send-contact-email.",
      });
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY")?.trim();
    const recipientEmail = Deno.env.get("CONTACT_NOTIFICATION_EMAIL")?.trim() || "nzweb295@gmail.com";
    const senderEmail = Deno.env.get("CONTACT_EMAIL_FROM")?.trim();

    if (!resendApiKey) {
      return jsonResponse(500, {
        message: "Email delivery is not configured.",
        code: "EMAIL_NOT_CONFIGURED",
        details: "Missing RESEND_API_KEY secret for the send-contact-email function.",
      });
    }

    if (!senderEmail) {
      return jsonResponse(500, {
        message: "Email delivery sender is not configured.",
        code: "EMAIL_FROM_NOT_CONFIGURED",
        details: "Set CONTACT_EMAIL_FROM to a verified Resend sender, for example 'NZ WEB <noreply@your-domain.com>'.",
      });
    }

    if (!extractEmailAddress(senderEmail)) {
      return jsonResponse(500, {
        message: "Email delivery sender is invalid.",
        code: "EMAIL_FROM_INVALID",
        details: "CONTACT_EMAIL_FROM must be a valid email or display-name format accepted by Resend.",
      });
    }

    if (!isValidEmail(recipientEmail)) {
      return jsonResponse(500, {
        message: "Notification recipient email is invalid.",
        code: "CONTACT_NOTIFICATION_EMAIL_INVALID",
        details: "CONTACT_NOTIFICATION_EMAIL must be a valid email address.",
      });
    }

    let rawPayload: unknown;

    try {
      rawPayload = await request.json();
    } catch {
      return jsonResponse(400, {
        message: "Invalid JSON payload.",
        code: "INVALID_JSON",
        hint: "Submit a valid JSON body when invoking send-contact-email.",
      });
    }

    const payload = parsePayload(rawPayload);

    if (!payload) {
      return jsonResponse(400, {
        message: "Invalid contact email payload.",
        code: "INVALID_PAYLOAD",
        hint: "Provide leadId, name, email, phone, subject, createdAt, and sendMethod='email'.",
      });
    }

    const resendRequestBody: Record<string, unknown> = {
      from: senderEmail,
      to: [recipientEmail],
      subject: `פניית צור קשר חדשה | ${payload.name} | ${payload.subject}`,
      html: buildHtmlEmail(payload),
      text: buildTextEmail(payload),
    };

    if (isValidEmail(payload.email)) {
      resendRequestBody.reply_to = payload.email;
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resendRequestBody),
    });

    if (!resendResponse.ok) {
      const resendBody = await resendResponse.text();
      const providerErrorCode =
        resendResponse.status === 401 || resendResponse.status === 403
          ? "EMAIL_PROVIDER_AUTH_ERROR"
          : resendResponse.status === 400 || resendResponse.status === 422
            ? "EMAIL_PROVIDER_REJECTED"
            : "EMAIL_PROVIDER_ERROR";

      return jsonResponse(resendResponse.status >= 500 ? 502 : 500, {
        message: "Email provider request failed.",
        code: providerErrorCode,
        details: resendBody,
      });
    }

    return jsonResponse(200, { ok: true });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error";

    return jsonResponse(500, {
      message: "Unexpected internal error while sending contact email.",
      code: "EMAIL_INTERNAL_ERROR",
      details,
    });
  }
});

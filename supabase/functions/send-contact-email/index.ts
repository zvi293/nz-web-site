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

  return {
    leadId: candidate.leadId.trim(),
    name: candidate.name.trim(),
    email: candidate.email.trim(),
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

function buildHtmlEmail(payload: ContactEmailPayload): string {
  const rows = [
    ["שם מלא", payload.name],
    ["אימייל", payload.email],
    ["טלפון", payload.phone],
    ["שם חברה / עסק", payload.companyName ?? "לא נמסר"],
    ["נושא הפנייה", payload.subject],
    ["אופן פנייה", "אימייל"],
    ["נשלח בתאריך", formatTimestamp(payload.createdAt)],
    ["מזהה ליד", payload.leadId],
  ];

  const rowHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;font-weight:700;border-bottom:1px solid #e5e7eb;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `
    <div dir="rtl" style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
        <div style="padding:24px;background:linear-gradient(135deg,#0f172a,#2563eb);color:#ffffff;">
          <h1 style="margin:0;font-size:24px;">פניית צור קשר חדשה</h1>
          <p style="margin:8px 0 0;font-size:14px;opacity:0.9;">המערכת קיבלה ליד חדש מטופס יצירת הקשר באתר.</p>
        </div>
        <div style="padding:24px;">
          <table style="width:100%;border-collapse:collapse;font-size:15px;">
            <tbody>${rowHtml}</tbody>
          </table>
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
    "אופן פנייה: אימייל",
    `נשלח בתאריך: ${formatTimestamp(payload.createdAt)}`,
    `מזהה ליד: ${payload.leadId}`,
  ].join("\n");
}

Deno.serve(async (request) => {
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
  const senderEmail = Deno.env.get("CONTACT_EMAIL_FROM")?.trim() || "NZ WEB <onboarding@resend.dev>";

  if (!resendApiKey) {
    return jsonResponse(500, {
      message: "Email delivery is not configured.",
      code: "EMAIL_NOT_CONFIGURED",
      details: "Missing RESEND_API_KEY secret for the send-contact-email function.",
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

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: senderEmail,
      to: [recipientEmail],
      reply_to: payload.email,
      subject: `פניית צור קשר חדשה - ${payload.name}`,
      html: buildHtmlEmail(payload),
      text: buildTextEmail(payload),
    }),
  });

  if (!resendResponse.ok) {
    const resendBody = await resendResponse.text();
    return jsonResponse(502, {
      message: "Email provider request failed.",
      code: "EMAIL_PROVIDER_ERROR",
      details: resendBody,
    });
  }

  return jsonResponse(200, { ok: true });
});

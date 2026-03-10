const reportedMessages = new Set<string>();
const blockedLogoHosts = new Set(["logo.clearbit.com"]);

interface DataUriOptions {
  background?: string;
  foreground?: string;
  fontSize?: number;
}

export function reportDevNoticeOnce(key: string, message: string, error?: unknown) {
  if (!import.meta.env.DEV || reportedMessages.has(key)) {
    return;
  }

  reportedMessages.add(key);

  if (error) {
    console.info(message, error);
    return;
  }

  console.info(message);
}

export function isRenderableAssetUrl(value?: string | null): value is string {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return false;
  }

  if (trimmed.startsWith("data:")) {
    return trimmed.startsWith("data:image/");
  }

  if (trimmed.startsWith("blob:")) {
    return true;
  }

  if (trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      parsed.pathname.trim() !== "" &&
      parsed.pathname !== "/"
    );
  } catch {
    return false;
  }
}

export function isBlockedLogoUrl(value?: string | null): boolean {
  if (!value) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return blockedLogoHosts.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function normalizeLogoImageUrl(name: string, value?: string | null) {
  if (isRenderableAssetUrl(value) && !isBlockedLogoUrl(value)) {
    return value;
  }

  return createLabeledImageDataUri(name, { background: "#ffffff", foreground: "#0f172a", fontSize: 28 });
}

export function createLabeledImageDataUri(label: string, options: DataUriOptions = {}) {
  const safeLabel = label.trim() || "NZ-WEB";
  const escapedLabel = escapeXml(safeLabel);
  const background = options.background ?? "#f5f7fb";
  const foreground = options.foreground ?? "#0f172a";
  const fontSize = options.fontSize ?? 26;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="160" viewBox="0 0 320 160" role="img" aria-label="${escapedLabel}">
      <rect width="320" height="160" rx="28" fill="${background}" />
      <text
        x="160"
        y="88"
        text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${fontSize}"
        font-weight="700"
        fill="${foreground}"
      >${escapedLabel}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
}

export function isSafeInlineSvg(markup?: string | null): markup is string {
  if (!markup) {
    return false;
  }

  const trimmed = markup.trim();

  if (!trimmed.startsWith("<svg") || /\b(undefined|null)\b/i.test(trimmed)) {
    return false;
  }

  if (typeof DOMParser === "undefined") {
    return true;
  }

  const doc = new DOMParser().parseFromString(trimmed, "image/svg+xml");

  if (doc.querySelector("parsererror")) {
    return false;
  }

  return Array.from(doc.querySelectorAll("path")).every((path) => {
    const d = path.getAttribute("d");
    return d !== null && d.trim() !== "" && !/^(undefined|null)$/i.test(d.trim());
  });
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

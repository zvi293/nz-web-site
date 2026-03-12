export function formatRepositoryError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const details: string[] = [];

    const message = "message" in error && typeof error.message === "string" ? error.message : null;
    const code = "code" in error && typeof error.code === "string" ? error.code : null;
    const hint = "hint" in error && typeof error.hint === "string" ? error.hint : null;
    const detail = "details" in error && typeof error.details === "string" ? error.details : null;

    if (message) details.push(message);
    if (code) details.push(`code: ${code}`);
    if (detail) details.push(`details: ${detail}`);
    if (hint) details.push(`hint: ${hint}`);

    if (details.length > 0) {
      return details.join(" | ");
    }
  }

  return "Unknown error";
}

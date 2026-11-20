/**
 * A glossary term's other name split on " · ", each part marked when it is English only (no Hebrew
 * letters), so it can carry lang="en" (WCAG 3.1.2: a Hebrew voice would otherwise mispronounce
 * "Time to First Byte"). Tiny on purpose: the GlossaryDrawer island imports it.
 */
export function altParts(alt: string): { text: string; en: boolean }[] {
  return alt.split(" · ").map((text) => ({ text, en: /[A-Za-z]/.test(text) && !/[\u0590-\u05FF]/.test(text) }));
}

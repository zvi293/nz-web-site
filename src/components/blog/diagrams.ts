/**
 * Article diagrams — small designed HTML figures used by the content renderer
 * (":::split diagram=<key>" / ":::diagram <key>" in src/content/blog.ts, see src/lib/blog.ts).
 * HTML + CSS (article.css, prefix dg-), not SVG text, so the Hebrew stays readable at 360px and
 * follows the a11y widget's text size. Each figure is one role="img" with a full Hebrew label
 * (its parts are presentational); the article text around it carries the same information.
 * Facts only: every label restates something the article itself says.
 */

const DIAGRAMS: Record<string, string> = {
  /* website-accessibility-israel — the four WCAG principles hold up the AA level, standing on ת"י 5568 */
  "wcag-pillars": `
<div class="dg dg-temple" role="img" aria-label="תרשים: ארבעת העקרונות של WCAG, ניתן לתפיסה, ניתן לתפעול, מובן וחסין, הם ארבעה עמודים שמחזיקים את רמה AA, ועומדים על התקן הישראלי ת&quot;י 5568.">
  <div class="dg-temple__roof"><span class="dg-temple__pediment"></span><span class="dg-temple__level"><bdi>WCAG 2.1</bdi> · רמה AA</span></div>
  <div class="dg-temple__cols">
    <div class="dg-temple__col"><span class="dg-temple__n">1</span><span class="dg-temple__name">ניתן לתפיסה</span><span class="dg-temple__sub">רואים או שומעים</span></div>
    <div class="dg-temple__col"><span class="dg-temple__n">2</span><span class="dg-temple__name">ניתן לתפעול</span><span class="dg-temple__sub">גם בלי עכבר</span></div>
    <div class="dg-temple__col"><span class="dg-temple__n">3</span><span class="dg-temple__name">מובן</span><span class="dg-temple__sub">צפוי וברור</span></div>
    <div class="dg-temple__col"><span class="dg-temple__n">4</span><span class="dg-temple__name">חסין</span><span class="dg-temple__sub">קוד תקני</span></div>
  </div>
  <div class="dg-temple__base"><span>ת"י 5568</span><span class="dg-temple__sub">התקן הישראלי</span></div>
</div>`,

  /* geo-ai-search-guide — the two ways an answer engine learns about a business */
  "ai-sources": `
<div class="dg dg-flow" role="img" aria-label="תרשים: שאלה של לקוח מגיעה למנוע AI. יש שני מקורות: מה שהמודל למד מראש, שעליו יש לעסק שליטה נמוכה, וחיפוש בזמן אמת דרך האינדקס של גוגל ובינג, שמגיע לאתר שלכם. משניהם נבנית תשובה מנוסחת עם קישור למקור.">
  <p class="dg-flow__q"><span class="dg-flow__k">השאלה</span>"מי בונה אתרים לקליניקות?"</p>
  <div class="dg-flow__fork">
    <div class="dg-flow__path dg-flow__path--weak">
      <p class="dg-flow__node"><span class="dg-flow__k">מקור 1</span>מה שהמודל למד מראש</p>
      <p class="dg-flow__note">שליטה נמוכה לעסק קטן</p>
    </div>
    <div class="dg-flow__path dg-flow__path--strong">
      <p class="dg-flow__node"><span class="dg-flow__k">מקור 2</span>חיפוש בזמן אמת</p>
      <p class="dg-flow__node dg-flow__node--sm">אינדקס גוגל ובינג</p>
      <p class="dg-flow__node dg-flow__node--site">האתר שלכם<span class="dg-flow__note">כאן אתם משפיעים</span></p>
    </div>
  </div>
  <p class="dg-flow__a"><span class="dg-flow__k">התשובה</span>ניסוח + קישור למקור</p>
</div>`,

  /* business-website-or-online-store — the options in between, by how much running they need */
  "store-spectrum": `
<div class="dg dg-spectrum" role="img" aria-label="תרשים: חמש אפשרויות מאתר תדמית ועד חנות אונליין, ולידן כמה תפעול כל אחת דורשת אחרי ההשקה: אתר תדמית, פניות; אתר עם קטלוג, עדכון מוצרים; אתר עם קביעת תורים, יומן ותזכורות; אתר עם חנות קטנה, הזמנות ומשלוחים בקטן; חנות אונליין, מלאי, משלוחים ושירות לקוחות.">
  <p class="dg-spectrum__axis"><span>כמה תפעול זה דורש אחרי ההשקה</span><span class="dg-spectrum__arrow"></span></p>
  <ol class="dg-spectrum__list">
    <li style="--lvl: 1"><span class="dg-spectrum__name">אתר תדמית</span><span class="dg-spectrum__bar"></span><span class="dg-spectrum__load">פניות</span></li>
    <li style="--lvl: 2"><span class="dg-spectrum__name">אתר עם קטלוג</span><span class="dg-spectrum__bar"></span><span class="dg-spectrum__load">עדכון מוצרים</span></li>
    <li style="--lvl: 3"><span class="dg-spectrum__name">אתר עם קביעת תורים</span><span class="dg-spectrum__bar"></span><span class="dg-spectrum__load">יומן ותזכורות</span></li>
    <li style="--lvl: 4"><span class="dg-spectrum__name">אתר עם חנות קטנה</span><span class="dg-spectrum__bar"></span><span class="dg-spectrum__load">הזמנות ומשלוחים בקטן</span></li>
    <li style="--lvl: 5"><span class="dg-spectrum__name">חנות אונליין</span><span class="dg-spectrum__bar"></span><span class="dg-spectrum__load">מלאי, משלוחים, שירות</span></li>
  </ol>
</div>`,

  /* website-content-writing-guide — a homepage on a phone, in the order the article lists */
  "homepage-anatomy": `
<div class="dg dg-phone" role="img" aria-label="שרטוט של עמוד בית בטלפון, מחולק לתשעה חלקים לפי הסדר ברשימה: כותרת ראשית, שורת משנה, קריאה לפעולה, השירותים, למה אתם, איך זה עובד, עבודות, שאלות נפוצות וקריאה לפעולה בסוף.">
  <div class="dg-phone__body">
    <span class="dg-phone__notch"></span>
    <div class="dg-phone__band dg-phone__band--h1"><i>1</i><b></b><b class="is-short"></b></div>
    <div class="dg-phone__band"><i>2</i><b class="is-thin"></b></div>
    <div class="dg-phone__band"><i>3</i><b class="is-cta"></b></div>
    <div class="dg-phone__band dg-phone__band--cards"><i>4</i><b class="is-card"></b><b class="is-card"></b><b class="is-card"></b></div>
    <div class="dg-phone__band"><i>5</i><b class="is-thin"></b><b class="is-thin is-short"></b></div>
    <div class="dg-phone__band dg-phone__band--steps"><i>6</i><b class="is-dot"></b><b class="is-dot"></b><b class="is-dot"></b></div>
    <div class="dg-phone__band dg-phone__band--cards"><i>7</i><b class="is-img"></b><b class="is-img"></b></div>
    <div class="dg-phone__band"><i>8</i><b class="is-thin"></b><b class="is-thin"></b></div>
    <div class="dg-phone__band"><i>9</i><b class="is-cta"></b></div>
  </div>
</div>`,
};

/** HTML of a diagram by key ("" for an unknown key, with a dev warning). */
export function renderDiagram(key: string): string {
  const html = DIAGRAMS[key];
  if (!html && import.meta.env?.DEV) console.warn(`[blog] unknown diagram "${key}"`);
  return html?.trim() ?? "";
}

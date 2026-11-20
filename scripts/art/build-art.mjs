/**
 * Art pipeline: converts the curated source PNGs (scripts/art/registry.mjs)
 * into responsive AVIF + WebP files and writes the manifest the site reads.
 *
 *   npm run art            — convert new / changed images only
 *   npm run art -- --force — re-encode everything
 *
 * Output:
 *   src/assets/art/<slug>-<width>.{avif,webp}   (widths 320 / 640 / 828 / 1080 / 1600)
 *   AVIF is 4:2:0 (chroma at half resolution: invisible on these works, ~20% lighter) at quality 52,
 *   or the entry's `avifQ` for busy LCP heroes. 320 serves thumbnails, 828 serves DPR-2 phones.
 *   src/content/art-manifest.json               (size, dominant colour, LQIP, title, alt, tone)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { registry } from "./registry.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SRC_DIR = path.join(ROOT, "תמונות תדמית");
const OUT_DIR = path.join(ROOT, "src/assets/art");
const MANIFEST = path.join(ROOT, "src/content/art-manifest.json");
const WIDTHS = [320, 640, 828, 1080, 1600];
const force = process.argv.includes("--force");

fs.mkdirSync(OUT_DIR, { recursive: true });
const previous = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};
const manifest = {};
const slugs = new Set();

for (const item of registry) {
  if (slugs.has(item.slug)) throw new Error(`Duplicate slug: ${item.slug}`);
  slugs.add(item.slug);
  const src = path.join(SRC_DIR, item.file);
  const outputs = WIDTHS.flatMap((w) => ["avif", "webp"].map((ext) => path.join(OUT_DIR, `${item.slug}-${w}.${ext}`)));
  const have = previous[item.slug] && outputs.every((f) => fs.existsSync(f));

  if (!fs.existsSync(src)) {
    if (have) { manifest[item.slug] = { ...previous[item.slug], title: item.title, alt: item.alt, tone: item.tone }; continue; }
    throw new Error(`Missing source image: ${item.file}`);
  }

  if (have && !force) {
    manifest[item.slug] = { ...previous[item.slug], title: item.title, alt: item.alt, tone: item.tone };
    continue;
  }

  const img = sharp(src);
  const meta = await img.metadata();
  for (const w of WIDTHS) {
    const width = Math.min(w, meta.width);
    const base = sharp(src).resize({ width, withoutEnlargement: true });
    await base.clone().avif({ quality: item.avifQ ?? 52, effort: 5, chromaSubsampling: "4:2:0" }).toFile(path.join(OUT_DIR, `${item.slug}-${w}.avif`));
    await base.clone().webp({ quality: 74, effort: 5 }).toFile(path.join(OUT_DIR, `${item.slug}-${w}.webp`));
  }
  const { dominant } = await sharp(src).stats();
  const lqipBuf = await sharp(src).resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toBuffer();
  const hex = "#" + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("");
  manifest[item.slug] = {
    width: meta.width,
    height: meta.height,
    color: hex,
    lqip: `data:image/webp;base64,${lqipBuf.toString("base64")}`,
    tone: item.tone,
    title: item.title,
    alt: item.alt,
  };
  console.log(`✓ ${item.slug}`);
}

// Remove outputs of slugs that left the registry.
for (const f of fs.readdirSync(OUT_DIR)) {
  const slug = f.replace(/-\d+\.(avif|webp)$/, "");
  if (!slugs.has(slug)) { fs.unlinkSync(path.join(OUT_DIR, f)); console.log(`✗ removed ${f}`); }
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Manifest: ${Object.keys(manifest).length} works`);

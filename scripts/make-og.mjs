/**
 * Generate the social share card (public/og.png, 1200x630) and the
 * favicon set (src/app/icon.png 512px, src/app/apple-icon.png 180px)
 * from the brand tokens and the processed character art.
 *
 * Usage: node scripts/make-og.mjs
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const bros = (id) => path.join(root, "public/bros", `${id}.webp`);

const BG = "#0a0a0b";
const PAPER = "#f5f5f4";
const MUTED = "#b9b9c2";
const BRAND = "#bf8cff";
const ACCENT = "#ff7ab6";

/* ---------- og.png ---------- */

const ogBg = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="28%" cy="45%" r="65%">
      <stop offset="0%" stop-color="${BRAND}" stop-opacity="0.22"/>
      <stop offset="60%" stop-color="${BRAND}" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="${BRAND}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="85%" cy="80%" r="50%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="pill" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${BRAND}"/>
      <stop offset="100%" stop-color="${ACCENT}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="${BG}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <text x="80" y="285" font-family="Helvetica, Arial, sans-serif" font-weight="800"
        font-size="132" fill="${PAPER}" letter-spacing="-4">Bro<tspan fill="${BRAND}">.</tspan></text>

  <text x="84" y="352" font-family="Helvetica, Arial, sans-serif" font-weight="500"
        font-size="38" fill="${MUTED}">Personalities that join</text>
  <text x="84" y="402" font-family="Helvetica, Arial, sans-serif" font-weight="500"
        font-size="38" fill="${MUTED}">your group chat.</text>

  <rect x="84" y="458" rx="32" width="332" height="64" fill="url(#pill)"/>
  <text x="250" y="499" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-weight="700" font-size="22" fill="${BG}" letter-spacing="1">JOIN THE WAITLIST</text>

  <text x="84" y="582" font-family="Helvetica, Arial, sans-serif" font-weight="500"
        font-size="22" fill="#7c7c84">Every group chat deserves a Bro</text>
</svg>`);

async function fit(id, height) {
  const buf = await sharp(bros(id)).resize({ height }).png().toBuffer();
  const meta = await sharp(buf).metadata();
  return { buf, w: meta.width, h: meta.height };
}

const kai = await fit("bava", 470);
const blaze = await fit("trouble", 560);

await sharp(ogBg)
  .composite([
    { input: kai.buf, left: 1150 - blaze.w - kai.w + 90, top: 630 - kai.h },
    { input: blaze.buf, left: 1170 - blaze.w, top: 630 - blaze.h },
  ])
  .png()
  .toFile(path.join(root, "public/og.png"));

/* ---------- icons ---------- */

const iconSvg = (size) => {
  const r = Math.round(size * 0.23);
  const fs = Math.round(size * 0.6);
  return Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${BRAND}"/>
      <stop offset="100%" stop-color="${ACCENT}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>
  <text x="46%" y="50%" dominant-baseline="central" text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif" font-weight="800"
        font-size="${fs}" fill="${BG}">B</text>
  <circle cx="${Math.round(size * 0.76)}" cy="${Math.round(size * 0.72)}" r="${Math.round(size * 0.055)}" fill="${BG}"/>
</svg>`);
};

await sharp(iconSvg(512)).png().toFile(path.join(root, "src/app/icon.png"));
await sharp(iconSvg(180)).png().toFile(path.join(root, "src/app/apple-icon.png"));

const og = await sharp(path.join(root, "public/og.png")).metadata();
console.log(`og.png ${og.width}x${og.height}, icon.png 512, apple-icon.png 180`);

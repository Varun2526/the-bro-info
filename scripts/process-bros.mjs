/**
 * Process raw Bro art into site-ready assets.
 *
 * The source PNGs are NOT transparent — the checkerboard "transparency"
 * pattern is baked in as opaque pixels. So per image:
 *   1. flood-fill from the borders to key out the light-gray checker
 *      (keeps light areas inside the character, since the fill can't
 *      cross the dark cartoon outlines)
 *   2. trim the now-transparent padding
 *   3. if the result is wide, it has two side-by-side figures — keep the left
 *   4. resize and emit WebP
 *
 * Usage: node scripts/process-bros.mjs
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../public/bros");

const SOURCES = {
  "trouble_bro-main.png": "trouble",
  "drama-queen-main.png": "drama",
  "finanace-bro-main.png": "finance",
  "observer-bro-main.png": "observer",
  "sicker-bava-main.png": "bava",
  "spidy-bro-main.png": "spidy",
};

function keyOutBackground(data, width, height) {
  const isBg = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    return max - min <= 32 && min >= 100;
  };

  const visited = new Uint8Array(width * height);
  const stack = [];

  // Seed with all border pixels that look like checker background.
  for (let x = 0; x < width; x++) {
    for (const y of [0, height - 1]) {
      const p = y * width + x;
      if (!visited[p] && isBg(p * 4)) { visited[p] = 1; stack.push(p); }
    }
  }
  for (let y = 0; y < height; y++) {
    for (const x of [0, width - 1]) {
      const p = y * width + x;
      if (!visited[p] && isBg(p * 4)) { visited[p] = 1; stack.push(p); }
    }
  }

  while (stack.length) {
    const p = stack.pop();
    const x = p % width, y = (p / width) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const np = ny * width + nx;
      if (!visited[np] && isBg(np * 4)) { visited[np] = 1; stack.push(np); }
    }
  }

  // Erase background; soften the 1px anti-aliased halo at the boundary.
  for (let p = 0; p < width * height; p++) {
    if (visited[p]) data[p * 4 + 3] = 0;
  }
  for (let p = 0; p < width * height; p++) {
    if (visited[p]) continue;
    const x = p % width, y = (p / width) | 0;
    let bgNeighbors = 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      if (visited[ny * width + nx]) bgNeighbors++;
    }
    if (bgNeighbors > 0) {
      const i = p * 4;
      const max = Math.max(data[i], data[i + 1], data[i + 2]);
      const min = Math.min(data[i], data[i + 1], data[i + 2]);
      // Light, desaturated edge pixel = checker bleed; fade it.
      if (max - min <= 40 && min >= 100) data[i + 3] = 90;
    }
  }
}

for (const [src, id] of Object.entries(SOURCES)) {
  const input = path.join(dir, src);
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  keyOutBackground(data, info.width, info.height);

  let img = sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).trim({ threshold: 10 });
  let buf = await img.png().toBuffer({ resolveWithObject: true });

  if (buf.info.width / buf.info.height > 0.9) {
    img = sharp(buf.data)
      .extract({
        left: 0,
        top: 0,
        width: Math.floor(buf.info.width * (id === "bava" ? 0.42 : 0.48)),
        height: buf.info.height,
      })
      .trim({ threshold: 10 });
    buf = await img.png().toBuffer({ resolveWithObject: true });
  }

  const out = path.join(dir, `${id}.webp`);
  await sharp(buf.data)
    .resize({ height: 900, withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(out);

  const meta = await sharp(out).metadata();
  console.log(`${id}.webp  ${meta.width}x${meta.height}`);
}

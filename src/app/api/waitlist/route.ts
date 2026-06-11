import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Minimal local waitlist store: appends signups to .data/waitlist.json.
 * Swap the body of `save` for Supabase/SMS provider when ready.
 */
const FILE = path.join(process.cwd(), ".data", "waitlist.json");

async function save(phone: string) {
  await mkdir(path.dirname(FILE), { recursive: true });
  let entries: { phone: string; at: string }[] = [];
  try {
    entries = JSON.parse(await readFile(FILE, "utf8"));
  } catch {
    // first signup — file doesn't exist yet
  }
  if (!entries.some((e) => e.phone === phone)) {
    entries.push({ phone, at: new Date().toISOString() });
    await writeFile(FILE, JSON.stringify(entries, null, 2));
  }
}

export async function POST(request: Request) {
  let phone: unknown;
  try {
    ({ phone } = await request.json());
  } catch {
    return Response.json({ error: "invalid body" }, { status: 400 });
  }

  if (typeof phone !== "string") {
    return Response.json({ error: "invalid phone" }, { status: 400 });
  }

  // Normalize: keep digits and a leading +
  const normalized =
    (phone.trim().startsWith("+") ? "+" : "") + phone.replace(/\D/g, "");
  const digits = normalized.replace(/\D/g, "");

  if (digits.length < 8 || digits.length > 15) {
    return Response.json({ error: "invalid phone" }, { status: 400 });
  }

  await save(normalized);
  return Response.json({ ok: true });
}

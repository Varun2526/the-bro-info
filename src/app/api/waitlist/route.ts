import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Minimal local waitlist store: appends signups to .data/waitlist.json.
 * Swap the body of `save` for Supabase/Resend/etc. when ready.
 */
const FILE = path.join(process.cwd(), ".data", "waitlist.json");

async function save(email: string) {
  await mkdir(path.dirname(FILE), { recursive: true });
  let entries: { email: string; at: string }[] = [];
  try {
    entries = JSON.parse(await readFile(FILE, "utf8"));
  } catch {
    // first signup — file doesn't exist yet
  }
  if (!entries.some((e) => e.email === email)) {
    entries.push({ email, at: new Date().toISOString() });
    await writeFile(FILE, JSON.stringify(entries, null, 2));
  }
}

export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return Response.json({ error: "invalid body" }, { status: 400 });
  }

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254
  ) {
    return Response.json({ error: "invalid email" }, { status: 400 });
  }

  await save(email.toLowerCase());
  return Response.json({ ok: true });
}

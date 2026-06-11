import { ensureSchema, getPool } from "@/lib/db";

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

  try {
    await ensureSchema();
    await getPool().query(
      "INSERT INTO waitlist (phone) VALUES ($1) ON CONFLICT (phone) DO NOTHING",
      [normalized]
    );
  } catch (err) {
    console.error("waitlist insert failed:", err);
    return Response.json({ error: "storage unavailable" }, { status: 503 });
  }

  return Response.json({ ok: true });
}

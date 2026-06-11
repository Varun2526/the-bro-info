import { ensureSchema, getPool } from "@/lib/db";

/**
 * Optional presentation offset for the public counter/position
 * (set WAITLIST_BASE in env). Defaults to honest zero.
 */
function base(): number {
  const n = parseInt(process.env.WAITLIST_BASE ?? "0", 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export async function GET() {
  try {
    await ensureSchema();
    const { rows } = await getPool().query("SELECT COUNT(*)::int AS n FROM waitlist");
    return Response.json({ count: rows[0].n + base() });
  } catch (err) {
    console.error("waitlist count failed:", err);
    return Response.json({ count: null }, { status: 503 });
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

  try {
    await ensureSchema();
    const pool = getPool();
    // Upsert so repeat submits still return the original position.
    const { rows } = await pool.query(
      `INSERT INTO waitlist (phone) VALUES ($1)
       ON CONFLICT (phone) DO UPDATE SET phone = EXCLUDED.phone
       RETURNING id`,
      [normalized]
    );
    const { rows: posRows } = await pool.query(
      "SELECT COUNT(*)::int AS n FROM waitlist WHERE id <= $1",
      [rows[0].id]
    );
    return Response.json({ ok: true, position: posRows[0].n + base() });
  } catch (err) {
    console.error("waitlist insert failed:", err);
    return Response.json({ error: "storage unavailable" }, { status: 503 });
  }
}

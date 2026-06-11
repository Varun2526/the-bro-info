import { Pool } from "pg";

/**
 * Single shared connection pool. DATABASE_URL comes from .env.local in
 * development and the hosting provider's env settings in production.
 * The global stash keeps hot reload in dev from leaking pools.
 */
const globalForDb = globalThis as unknown as { __pgPool?: Pool };

export function getPool(): Pool {
  if (!globalForDb.__pgPool) {
    globalForDb.__pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
    });
  }
  return globalForDb.__pgPool;
}

let schemaReady: Promise<void> | null = null;

/** Create tables on first use so fresh environments just work. */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = getPool()
      .query(
        `CREATE TABLE IF NOT EXISTS waitlist (
           id BIGSERIAL PRIMARY KEY,
           phone TEXT NOT NULL UNIQUE,
           created_at TIMESTAMPTZ NOT NULL DEFAULT now()
         )`
      )
      .then(() => undefined);
  }
  return schemaReady;
}

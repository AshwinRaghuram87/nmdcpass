import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import { kv } from '@vercel/kv';

const KV_PASSES_KEY = 'nmdc_donimalai_entry_passes';

async function initPostgresTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS nmdc_passes_store (
      id VARCHAR(50) PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers for API calls
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Detect which database is available
  const hasPostgres = !!(
    process.env.POSTGRES_URL || 
    process.env.POSTGRES_PRISMA_URL || 
    process.env.DATABASE_URL || 
    process.env.DATABASE_URL_UNPOOLED
  );

  const hasKv = !!(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    process.env.KV_URL
  );

  try {
    // ----------------------------------------------------
    // GET: Retrieve Passes from Postgres or KV
    // ----------------------------------------------------
    if (req.method === 'GET') {
      // 1. Try Postgres (Neon)
      if (hasPostgres) {
        try {
          await initPostgresTable();
          const { rows } = await sql`
            SELECT data FROM nmdc_passes_store WHERE id = 'latest_passes' LIMIT 1;
          `;
          const passesData = rows.length > 0 && Array.isArray(rows[0].data) ? rows[0].data : [];
          return res.status(200).json({
            status: 'success',
            source: 'vercel_postgres',
            count: passesData.length,
            passes: passesData
          });
        } catch (dbErr: any) {
          console.error('Postgres read query failed:', dbErr);
          // If query failed, continue to KV check or report error
        }
      }

      // 2. Try KV (Upstash)
      if (hasKv) {
        try {
          const stored = await kv.get<any[]>(KV_PASSES_KEY);
          return res.status(200).json({
            status: 'success',
            source: 'vercel_kv',
            count: (stored || []).length,
            passes: stored || []
          });
        } catch (kvErr: any) {
          console.error('KV read query failed:', kvErr);
        }
      }

      // 3. Fallback when neither database is reachable or environment variables aren't injected
      return res.status(200).json({
        status: 'fallback',
        source: 'local_fallback',
        message: 'No cloud database active on Vercel yet. Env variables might need redeploy.',
        passes: null
      });
    }

    // ----------------------------------------------------
    // POST: Store Passes in Postgres or KV
    // ----------------------------------------------------
    if (req.method === 'POST') {
      const { passes } = req.body || {};

      if (!Array.isArray(passes)) {
        return res.status(400).json({
          status: 'error',
          error: 'Invalid passes payload: expected array'
        });
      }

      // 1. Try Postgres
      if (hasPostgres) {
        try {
          await initPostgresTable();
          const jsonString = JSON.stringify(passes);
          // Insert or update as JSONB
          await sql`
            INSERT INTO nmdc_passes_store (id, data, updated_at)
            VALUES ('latest_passes', ${jsonString}::jsonb, CURRENT_TIMESTAMP)
            ON CONFLICT (id)
            DO UPDATE SET data = ${jsonString}::jsonb, updated_at = CURRENT_TIMESTAMP;
          `;
          return res.status(200).json({
            status: 'success',
            source: 'vercel_postgres',
            count: passes.length
          });
        } catch (dbErr: any) {
          console.error('Postgres write query failed:', dbErr);
          return res.status(500).json({
            status: 'error',
            source: 'vercel_postgres',
            message: dbErr?.message || 'Database write error'
          });
        }
      }

      // 2. Try KV
      if (hasKv) {
        try {
          await kv.set(KV_PASSES_KEY, passes);
          return res.status(200).json({
            status: 'success',
            source: 'vercel_kv',
            count: passes.length
          });
        } catch (kvErr: any) {
          console.error('KV write query failed:', kvErr);
          return res.status(500).json({
            status: 'error',
            source: 'vercel_kv',
            message: kvErr?.message || 'KV write error'
          });
        }
      }

      // 3. Fallback
      return res.status(200).json({
        status: 'fallback',
        source: 'local_fallback',
        message: 'No database configured. Storing in browser only.',
        count: passes.length
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API /api/passes uncaught error:', error);
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Internal server error',
      passes: null
    });
  }
}

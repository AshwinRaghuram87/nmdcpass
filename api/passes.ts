import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

const KV_PASSES_KEY = 'nmdc_donimalai_entry_passes';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check if KV credentials are configured
  const isKvConfigured = !!(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    process.env.KV_URL
  );

  try {
    if (req.method === 'GET') {
      if (!isKvConfigured) {
        return res.status(200).json({
          status: 'fallback',
          source: 'local_fallback',
          message: 'Vercel KV not connected yet. Storing locally in browser.',
          passes: null
        });
      }

      const stored = await kv.get(KV_PASSES_KEY);
      return res.status(200).json({
        status: 'success',
        source: 'vercel_kv',
        passes: stored || []
      });
    }

    if (req.method === 'POST') {
      const { passes } = req.body || {};

      if (!Array.isArray(passes)) {
        return res.status(400).json({ error: 'Invalid passes payload: expected array' });
      }

      if (!isKvConfigured) {
        return res.status(200).json({
          status: 'fallback',
          source: 'local_fallback',
          message: 'Vercel KV credentials not set in environment. Saved in browser.',
          count: passes.length
        });
      }

      await kv.set(KV_PASSES_KEY, passes);
      return res.status(200).json({
        status: 'success',
        source: 'vercel_kv',
        count: passes.length
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API /api/passes error:', error);
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Internal server error',
      passes: null
    });
  }
}

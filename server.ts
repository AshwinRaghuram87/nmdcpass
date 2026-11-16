import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const PASSES_FILE = path.join(DATA_DIR, 'passes_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

import { INITIAL_PASSES } from './src/data/initialPasses';

// Helper to read stored passes
function readPassesFromDisk(): any[] | null {
  try {
    if (fs.existsSync(PASSES_FILE)) {
      const content = fs.readFileSync(PASSES_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } else {
      // Seed initial passes
      writePassesToDisk(INITIAL_PASSES);
      return INITIAL_PASSES;
    }
  } catch (err) {
    console.error('Error reading passes from disk:', err);
  }
  return INITIAL_PASSES;
}

// Helper to write passes to disk atomically
function writePassesToDisk(passes: any[]): boolean {
  try {
    const tempFile = `${PASSES_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(passes, null, 2), 'utf-8');
    fs.renameSync(tempFile, PASSES_FILE);
    return true;
  } catch (err) {
    console.error('Error writing passes to disk:', err);
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Support large file uploads (such as high-res JPEGs and scanned documents) up to 100MB
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  // CORS headers
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  // --------------------------------------------------------------------------
  // API: Health & Status
  // --------------------------------------------------------------------------
  app.get('/api/health', (req, res) => {
    const passes = readPassesFromDisk() || [];
    res.json({
      status: 'ok',
      database: 'connected',
      storageType: 'persistent_filesystem',
      passesCount: passes.length,
      timestamp: new Date().toISOString()
    });
  });

  // --------------------------------------------------------------------------
  // API: GET /api/passes
  // --------------------------------------------------------------------------
  app.get('/api/passes', async (req, res) => {
    try {
      // 1. Try reading from server persistent store
      const passes = readPassesFromDisk();
      if (passes && passes.length > 0) {
        return res.status(200).json({
          status: 'success',
          source: 'server_database',
          count: passes.length,
          passes
        });
      }

      // 2. Return fallback empty list if not seeded yet
      return res.status(200).json({
        status: 'success',
        source: 'server_database',
        count: 0,
        passes: []
      });
    } catch (err: any) {
      console.error('GET /api/passes error:', err);
      return res.status(500).json({
        status: 'error',
        message: err?.message || 'Failed to retrieve passes from database'
      });
    }
  });

  // --------------------------------------------------------------------------
  // API: POST /api/passes (Save passes & attached JPEGs to database)
  // --------------------------------------------------------------------------
  app.post('/api/passes', async (req, res) => {
    try {
      const { passes } = req.body || {};
      if (!Array.isArray(passes)) {
        return res.status(400).json({
          status: 'error',
          error: 'Expected "passes" array in request body'
        });
      }

      const success = writePassesToDisk(passes);
      if (!success) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to write passes to server database'
        });
      }

      return res.status(200).json({
        status: 'success',
        source: 'server_database',
        count: passes.length,
        message: 'Passes and attached documents/JPEGs successfully stored in database'
      });
    } catch (err: any) {
      console.error('POST /api/passes error:', err);
      return res.status(500).json({
        status: 'error',
        message: err?.message || 'Internal server error while saving to database'
      });
    }
  });

  // --------------------------------------------------------------------------
  // Frontend Mounting: Vite Middleware (Dev) or Static Assets (Prod)
  // --------------------------------------------------------------------------
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NMDC Entry Pass Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

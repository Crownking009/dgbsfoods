const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json({ limit: '10mb' }));

// Serve static site (project root)
app.use(express.static(path.join(__dirname)));

const DATA_PATH = path.join(__dirname, 'data', 'products.json');

// Simple API to save products.json. Use only in local/dev.
app.post('/api/save-products', (req, res) => {
  const payload = req.body;
  // Simple Basic auth for local dev
  const auth = req.headers['authorization'] || '';
  const expected = 'Basic ' + Buffer.from('obaadmin:obaadmin1').toString('base64');
  if (auth !== expected) return res.status(401).json({ error: 'Unauthorized' });

  if (!Array.isArray(payload)) return res.status(400).json({ error: 'Expected array of products' });
  // Basic sanitization: ensure each item has id and name
  for (const p of payload) {
    if (typeof p.id !== 'string' || typeof p.name !== 'string') {
      return res.status(400).json({ error: 'Product entries must include id and name' });
    }
  }

  // Ensure assets/images exists
  const IMAGEDIR = path.join(__dirname, 'assets', 'images');
  try { if (!fs.existsSync(IMAGEDIR)) fs.mkdirSync(IMAGEDIR, { recursive: true }); } catch (e) { /* ignore */ }

  // Convert any embedded Data-URL images into files and update payload paths
  for (const p of payload) {
    try {
      if (p && p.img && typeof p.img === 'string' && p.img.startsWith('data:image/')) {
        // data:[<mediatype>][;base64],<data>
        const match = p.img.match(/^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/);
        if (match) {
          const mime = match[1];
          const ext = match[2] === 'jpeg' ? 'jpg' : match[2];
          const b64 = match[3];
          const buffer = Buffer.from(b64, 'base64');
          const filename = `${p.id}-${Date.now()}.${ext}`;
          const filepath = path.join(IMAGEDIR, filename);
          fs.writeFileSync(filepath, buffer);
          // store relative path for site
          p.img = `assets/images/${filename}`;
        }
      }
    } catch (e) {
      console.warn('Failed to process image for product', p && p.id, e && e.message);
    }
  }

  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(payload, null, 2), 'utf8');
    return res.json({ ok: true, written: payload.length });
  } catch (err) {
    console.error('Error writing products.json', err);
    return res.status(500).json({ error: 'Could not write file', details: err.message });
  }
});

app.get('/api/products', (req, res) => {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    const json = JSON.parse(raw);
    res.json(json);
  } catch (err) { res.status(500).json({ error: 'Could not read products.json' }); }
});

app.listen(PORT, () => {
  console.log(`Dev server running on http://localhost:${PORT}`);
  console.log('Serves static files and /api/save-products to persist data/products.json');
});

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import contactHandler from './api/contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // 1. API Route: /api/contact
  if (url.pathname === '/api/contact') {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        req.body = JSON.parse(body || '{}');

        // Adapters to emulate Vercel/Express req/res methods
        const resAdapter = {
          status: (code) => {
            res.statusCode = code;
            return resAdapter;
          },
          json: (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          }
        };

        await contactHandler(req, resAdapter);
      } catch (err) {
        console.error('Server error handling /api/contact:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: err.message || 'Server error' }));
      }
    });
    return;
  }

  // 2. Static File Serving
  let filePath = path.join(__dirname, url.pathname === '/' ? 'index.html' : url.pathname);

  // Security: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end('Access Denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Portfolio server running at: http://localhost:${PORT}`);
  console.log(`📧 Contact API endpoint ready at: http://localhost:${PORT}/api/contact`);
  console.log(`🔑 GMAIL_USER: ${process.env.GMAIL_USER ? process.env.GMAIL_USER : 'Not set (check .env)'}`);
  console.log(`🔑 GMAIL_PASS: ${process.env.GMAIL_PASS ? '********' : 'Not set (check .env)'}`);
  console.log(`==================================================\n`);
});


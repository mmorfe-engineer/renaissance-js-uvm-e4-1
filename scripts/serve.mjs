import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ttf': 'font/ttf', '.md': 'text/plain; charset=utf-8' };
const port = Number(process.env.PORT || 4173);
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const requested = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!requested.startsWith(root) || pathname.split('/').some(part => part.startsWith('.'))) { res.writeHead(403).end(); return; }
    const content = await readFile(requested);
    res.writeHead(200, { 'Content-Type': types[path.extname(requested)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    res.end(content);
  } catch { res.writeHead(404).end('Not found'); }
});
server.on('error', error => {
  console.error(`No se pudo iniciar el servidor (${error.code}): ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`Renaissance Lexicon: http://127.0.0.1:${port}`));

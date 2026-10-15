import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const allowed = new Set(['index.html', 'legacy.html', 'experience.js', 'experience-domain.js', 'experience.css', 'app.js', 'domain.js', 'styles.css', 'assets/mascota-poses.png']);
const types = { html: 'text/html; charset=utf-8', js: 'text/javascript; charset=utf-8', css: 'text/css; charset=utf-8', png: 'image/png' };
http.createServer(async (req, res) => {
  const name = new URL(req.url, 'http://localhost').pathname.slice(1) || 'index.html';
  if (!allowed.has(name)) { res.writeHead(404); res.end('No encontrado'); return; }
  try {
    const body = await readFile(fileURLToPath(new URL(name, import.meta.url)));
    res.writeHead(200, { 'Content-Type': types[name.split('.').pop()], 'X-Content-Type-Options': 'nosniff' }); res.end(body);
  } catch { res.writeHead(500); res.end('No se pudo leer el recurso'); }
}).listen(Number(process.env.PORT || 4173), '0.0.0.0', () => console.log('Henris Gallery: servidor iniciado en puerto ' + (process.env.PORT || 4173)));

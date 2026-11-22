import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const files = new Map([
  ['/', ['index.html', 'text/html']], ['/index.html', ['index.html', 'text/html']],
  ['/style.css', ['style.css', 'text/css']], ['/app.mjs', ['app.mjs', 'text/javascript']],
  ['/memo.mjs', ['memo.mjs', 'text/javascript']],
]);
export function createMemoServer() { return createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return; }
  let pathname;
  try { pathname = new URL(request.url || '/', 'http://localhost').pathname; }
  catch { response.writeHead(400); response.end('Invalid request URL'); return; }
  const file = files.get(pathname);
  if (!file) { response.writeHead(404); response.end('Not found'); return; }
  try {
    const body = await readFile(new URL(file[0], import.meta.url));
    response.writeHead(200, { 'content-type': file[1] + '; charset=utf-8', 'x-content-type-options': 'nosniff', 'cache-control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch { response.writeHead(500); response.end('Cannot read application file'); }
}); }
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = createMemoServer();
  server.on('error', error => { console.error(`Local server error: ${error.code}`); process.exitCode = 1; });
  server.listen(4173, '127.0.0.1', () => console.log('Memo Studio: http://127.0.0.1:4173/'));
}

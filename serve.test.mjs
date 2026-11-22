import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { connect } from 'node:net';
import { createMemoServer } from './serve.mjs';

test('local server exposes only app files and survives malformed request targets', async t => {
  const server = createMemoServer();
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;
  const page = await fetch(base);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Memo Studio/);
  for (const path of ['/package.json', '/.env', '/LICENSE', '/no-such-file']) {
    assert.equal((await fetch(base + path)).status, 404);
  }
  assert.equal((await fetch(base, { method: 'POST' })).status, 405);
  const head = await fetch(base + '/memo.mjs', { method: 'HEAD' });
  assert.equal(head.status, 200); assert.equal(await head.text(), '');
  const malformed = await new Promise((resolve, reject) => {
    const socket = connect(port, '127.0.0.1'); let output = '';
    socket.on('connect', () => socket.write('GET http://[ HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n'));
    socket.on('data', chunk => { output += chunk; });
    socket.on('end', () => resolve(output)); socket.on('error', reject);
  });
  assert.match(malformed, /HTTP\/1\.1 400/);
  assert.equal((await fetch(base)).status, 200);
});

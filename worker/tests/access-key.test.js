import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

const ORIGIN = 'https://svn11x.github.io';
const call = (headers, env) =>
  worker.fetch(new Request('https://w.example/', { headers: { Origin: ORIGIN, ...headers } }), env);

test('rejects every request when the secret is not configured', async () => {
  const res = await call({}, { AI: {} });
  assert.equal(res.status, 500);
  assert.equal((await res.json()).error, 'falta-clave-acceso');
});

test('rejects a missing or wrong key', async () => {
  for (const headers of [{}, { 'X-Clave': 'wrong' }, { 'X-Clave': 'secret-extra' }]) {
    const res = await call(headers, { AI: {}, CLAVE_ACCESO: 'secret' });
    assert.equal(res.status, 401);
  }
});

test('accepts the right key', async () => {
  const res = await call({ 'X-Clave': 'secret' }, { AI: {}, CLAVE_ACCESO: 'secret' });
  assert.equal(res.status, 200);
});

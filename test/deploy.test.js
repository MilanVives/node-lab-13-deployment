process.env.vivesbib_jwtPrivateKey = process.env.vivesbib_jwtPrivateKey || 'test-private-key';
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const request = require('supertest');
const db = require('./helpers/db');
const app = require('../src/app');

before(db.connect);
after(db.disconnect);

function deployUrl() {
  assert.ok(fs.existsSync('DEPLOY_URL.txt'), 'Create DEPLOY_URL.txt with the URL of your deployed app');
  const url = fs.readFileSync('DEPLOY_URL.txt', 'utf8').trim().replace(/\/+$/, '');
  assert.match(url, /^https?:\/\/[^\s/]+$/, 'DEPLOY_URL.txt should contain only the base URL of your app, like https://vivesbib-yourname.onrender.com');
  assert.ok(!url.includes('your-app'), 'Replace the placeholder in DEPLOY_URL.txt with the URL of your own deployment');
  return url;
}

async function getLive(path) {
  const url = deployUrl() + path;
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try { return await fetch(url, { signal: AbortSignal.timeout(50000) }); } catch (err) { lastError = err; }
  }
  assert.fail(`Could not reach ${url} (${lastError.message}). Free hosting can sleep: open the URL in your browser and submit again.`);
}

describe('R1: GET /health reports that the app is running', () => {
  it('responds 200 { status: "ok" }', async (t) => {
    t.mock.method(console, 'error', () => {});
    const res = await request(app).get('/health');
    assert.equal(res.status, 200, 'Add a GET /health route');
    assert.deepEqual(res.body, { status: 'ok' }, 'GET /health should return { status: "ok" }');
  });
});

describe('R2: DEPLOY_URL.txt contains the URL of your deployed app', () => {
  it('has a real URL', () => { deployUrl(); });
});

describe('R3: The deployed app answers /health', () => {
  it('GET <DEPLOY_URL>/health returns { status: "ok" }', { timeout: 170000 }, async () => {
    const res = await getLive('/health');
    assert.equal(res.status, 200, 'Your deployed app should answer GET /health with 200');
    assert.deepEqual(await res.json(), { status: 'ok' });
  });
});

describe('R4: The deployed app serves the genres', () => {
  it('GET <DEPLOY_URL>/api/genres returns a JSON array', { timeout: 170000 }, async () => {
    const res = await getLive('/api/genres');
    assert.equal(res.status, 200, 'Your deployed app should answer GET /api/genres with 200 (is MONGODB_URI set on the host?)');
    assert.ok(Array.isArray(await res.json()), 'GET /api/genres should return a JSON array');
  });
});

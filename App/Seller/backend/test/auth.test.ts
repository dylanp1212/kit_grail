import {test, describe, expect} from 'vitest';
import supertest from 'supertest';
import {http, HttpResponse} from 'msw';

import {server} from './setup';
import {fakeUser, fakeAuthenticated, mswServer} from './mswServer';

const AUTH_SERVICE = 'http://localhost:3010';

describe('GET /api/v0/auth/me', () => {
  test('returns 401 with no session cookie', async () => {
    await supertest(server)
      .get('/api/v0/auth/me')
      .expect(401);
  });

  test('returns user id when session cookie is valid', async () => {
    const res = await supertest(server)
      .get('/api/v0/auth/me')
      .set('Cookie', 'seller_session=fake-token');
    expect(res.body.id).toBe(fakeUser.id);
  });

  test('returns 401 when auth service rejects the token', async () => {
    mswServer.use(
      http.get(`${AUTH_SERVICE}/api/v0/check`, () =>
        new HttpResponse(null, {status: 401}), {once: true},
      ),
    );
    await supertest(server)
      .get('/api/v0/auth/me')
      .set('Cookie', 'seller_session=bad-token')
      .expect(401);
  });
});

describe('POST /api/v0/auth/signout', () => {
  test('returns ok: true', async () => {
    const res = await supertest(server)
      .post('/api/v0/auth/signout')
      .set('Cookie', 'seller_session=fake-token');
    expect(res.body.ok).toBe(true);
  });

  test('clears the session cookie', async () => {
    const res = await supertest(server)
      .post('/api/v0/auth/signout')
      .set('Cookie', 'seller_session=fake-token');
    const cookies = res.headers['set-cookie'] as string[];
    expect(cookies.some((c) => c.startsWith('seller_session=;'))).toBe(true);
  });
});

describe('GET /api/v0/auth/start/google', () => {
  test('redirects to Google OAuth', async () => {
    const res = await supertest(server)
      .get('/api/v0/auth/start/google')
      .expect(302);
    expect(res.headers.location).toContain('accounts.google.com');
  });

  test('sets state cookie on redirect', async () => {
    const res = await supertest(server)
      .get('/api/v0/auth/start/google');
    const cookies = res.headers['set-cookie'] as string[];
    expect(cookies.some((c) => c.startsWith('seller_oauth_state='))).toBe(true);
  });
});

describe('GET /api/v0/auth/profile/picture', () => {
  test('returns 401 with no session cookie', async () => {
    await supertest(server)
      .get('/api/v0/auth/profile/picture')
      .expect(401);
  });

  test('proxies the upstream response when token is valid', async () => {
    const res = await supertest(server)
      .get('/api/v0/auth/profile/picture')
      .set('Cookie', 'seller_session=fake-token')
      .expect(200);
    expect(res.body.url).toBe('http://fake.com/pic.jpg');
  });
});

describe('GET /api/v0/auth/callback/google', () => {
  test('redirects to login when code is missing', async () => {
    const res = await supertest(server)
      .get('/api/v0/auth/callback/google?state=teststate')
      .set('Cookie', 'seller_oauth_state=teststate');
    expect(res.headers.location).toBe('/sell/login');
  });

  test('redirects to login when state does not match cookie', async () => {
    const res = await supertest(server)
      .get('/api/v0/auth/callback/google?code=fake-code&state=wrong')
      .set('Cookie', 'seller_oauth_state=correct');
    expect(res.headers.location).toBe('/sell/login');
  });

  test('redirects to login when state cookie is absent', async () => {
    const res = await supertest(server)
      .get('/api/v0/auth/callback/google?code=fake-code&state=teststate');
    expect(res.headers.location).toBe('/sell/login');
  });

  test('redirects to /sell/ on successful exchange', async () => {
    const res = await supertest(server)
      .get('/api/v0/auth/callback/google?code=fake-code&state=teststate')
      .set('Cookie', 'seller_oauth_state=teststate');
    expect(res.headers.location).toBe('/sell/');
  });

  test('sets session cookie on successful exchange', async () => {
    const res = await supertest(server)
      .get('/api/v0/auth/callback/google?code=fake-code&state=teststate')
      .set('Cookie', 'seller_oauth_state=teststate');
    const cookies = res.headers['set-cookie'] as string[];
    expect(
      cookies.some((c) =>
        c.includes(`seller_session=${fakeAuthenticated.accessToken}`),
      ),
    ).toBe(true);
  });

  const callbackWithBadExchange = async (
    handler: Parameters<typeof mswServer.use>[0],
  ) => {
    mswServer.use(handler);
    return supertest(server)
      .get('/api/v0/auth/callback/google?code=bad-code&state=teststate')
      .set('Cookie', 'seller_oauth_state=teststate');
  };

  test('redirects to login with suspended error when account is suspended', async () => {
    const res = await callbackWithBadExchange(
      http.post(`${AUTH_SERVICE}/api/v0/auth/google/exchange/seller`, () =>
        new HttpResponse(null, {status: 403}), {once: true},
      ),
    );
    expect(res.headers.location).toBe('/sell/login?error=suspended');
  });

  test('redirects to login when auth service exchange fails', async () => {
    const res = await callbackWithBadExchange(
      http.post(`${AUTH_SERVICE}/api/v0/auth/google/exchange/seller`, () =>
        new HttpResponse(null, {status: 400}), {once: true},
      ),
    );
    expect(res.headers.location).toBe('/sell/login');
  });

  test('redirects to login when auth service throws', async () => {
    const res = await callbackWithBadExchange(
      http.post(`${AUTH_SERVICE}/api/v0/auth/google/exchange/seller`, () =>
        HttpResponse.error(), {once: true},
      ),
    );
    expect(res.headers.location).toBe('/sell/login');
  });
});

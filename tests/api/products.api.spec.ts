import { test, expect } from '@playwright/test';

test.describe('Products API @api', () => {
  test('lists every product with the expected contract', async ({ request }) => {
    const res = await request.get('/api/products');
    expect(res.status()).toBe(200);
    const products = await res.json();
    expect(products).toHaveLength(6);
    for (const p of products) {
      expect(p).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        category: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
      expect(p.price).toBeGreaterThan(0);
      expect(p.stock).toBeGreaterThanOrEqual(0);
    }
  });

  test('search is case-insensitive', async ({ request }) => {
    const res = await request.get('/api/products', { params: { q: 'SMART' } });
    const names = (await res.json()).map((p: { name: string }) => p.name);
    expect(names).toEqual(['Smart Watch']);
  });

  test('returns one product by id', async ({ request }) => {
    const res = await request.get('/api/products/3');
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ id: 3, name: 'Smart Watch', price: 129 });
  });

  test('returns 404 for an unknown product', async ({ request }) => {
    const res = await request.get('/api/products/999');
    expect(res.status()).toBe(404);
    expect(await res.json()).toEqual({ error: 'Product not found' });
  });
});

test.describe('Login API @api', () => {
  test('valid credentials return a token', async ({ request }) => {
    const res = await request.post('/api/login', { data: { username: 'shopper', password: 'Passw0rd!' } });
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ token: expect.stringMatching(/^token-shopper-/), name: 'Sam Shopper' });
  });

  test('wrong password returns 401 and locked account returns 403', async ({ request }) => {
    const wrong = await request.post('/api/login', { data: { username: 'shopper', password: 'nope' } });
    expect(wrong.status()).toBe(401);
    const locked = await request.post('/api/login', { data: { username: 'locked_user', password: 'Passw0rd!' } });
    expect(locked.status()).toBe(403);
  });
});

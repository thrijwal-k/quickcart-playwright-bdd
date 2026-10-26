import { test, expect } from '@playwright/test';

const customer = { name: 'Sam Shopper', email: 'sam@example.com', postcode: 'BS1 4DJ' };

test.describe('Orders API @api', () => {
  test('creates an order, calculates the total and can read it back', async ({ request }) => {
    const created = await request.post('/api/orders', {
      data: { items: [{ productId: 3, quantity: 1 }, { productId: 5, quantity: 2 }], customer },
    });
    expect(created.status()).toBe(201);
    const order = await created.json();
    expect(order).toMatchObject({ status: 'CONFIRMED', total: 168.98 });

    const fetched = await request.get(`/api/orders/${order.id}`);
    expect(fetched.status()).toBe(200);
    expect(await fetched.json()).toEqual(order);
  });

  const invalid = [
    { title: 'empty cart', body: { items: [], customer }, error: 'Order must contain at least one item' },
    { title: 'unknown product', body: { items: [{ productId: 99, quantity: 1 }], customer }, error: 'Unknown product 99' },
    { title: 'zero quantity', body: { items: [{ productId: 1, quantity: 0 }], customer }, error: 'Invalid quantity for Wireless Headphones' },
    { title: 'more than in stock', body: { items: [{ productId: 3, quantity: 6 }], customer }, error: 'Only 5 of Smart Watch in stock' },
    { title: 'sold-out product', body: { items: [{ productId: 4, quantity: 1 }], customer }, error: 'Only 0 of Fitness Band in stock' },
    { title: 'bad email', body: { items: [{ productId: 1, quantity: 1 }], customer: { ...customer, email: 'x' } }, error: 'A valid email is required' },
    { title: 'bad postcode', body: { items: [{ productId: 1, quantity: 1 }], customer: { ...customer, postcode: '123' } }, error: 'A valid UK postcode is required' },
  ];

  for (const { title, body, error } of invalid) {
    test(`rejects an order with ${title} (422)`, async ({ request }) => {
      const res = await request.post('/api/orders', { data: body });
      expect(res.status()).toBe(422);
      expect((await res.json()).errors).toContain(error);
    });
  }

  test('returns 404 for an unknown order', async ({ request }) => {
    const res = await request.get('/api/orders/1');
    expect(res.status()).toBe(404);
  });
});

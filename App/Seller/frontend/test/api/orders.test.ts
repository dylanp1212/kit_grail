import {describe, it, expect, vi} from 'vitest';
import {getOrders} from '../../src/api/orders';
import {sampleOrder} from '../fixtures/orders';

describe('getOrders', () => {
  it('returns orders on success', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [sampleOrder],
    });

    const result = await getOrders();
    expect(result).toEqual([sampleOrder]);
  });

  it('calls /api/v0/my-orders without query params', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    globalThis.fetch = mockFetch;

    await getOrders();
    expect(mockFetch).toHaveBeenCalledWith('/api/v0/my-orders');
  });

  it('returns empty array when seller has no orders', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const result = await getOrders();
    expect(result).toEqual([]);
  });


  it('throws on 404', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(getOrders()).rejects.toThrow('Failed: 404');
  });
});

import {describe, it, expect, vi} from 'vitest';
import {getOrders} from '../../src/api/orders';
import {sampleOrder} from '../fixtures/orders';

describe('getOrders', () => {
  it('returns orders on success', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [sampleOrder],
    });

    const result = await getOrders('fake-seller-id');
    expect(result).toEqual([sampleOrder]);
  });

  it('encodes the sellerID in the request URL', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    globalThis.fetch = mockFetch;

    await getOrders('seller with spaces');
    expect(mockFetch).toHaveBeenCalledWith(
        '/api/v0/my-orders?sellerID=seller%20with%20spaces',
    );
  });

  it('returns empty array when seller has no orders', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const result = await getOrders('fake-seller-id');
    expect(result).toEqual([]);
  });


  it('throws on 404', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(getOrders('unknown-seller')).rejects.toThrow('Failed: 404');
  });
});

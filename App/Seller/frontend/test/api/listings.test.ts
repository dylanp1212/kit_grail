import {describe, it, expect, vi} from 'vitest';
import {getAllListings} from '../../src/api/listings';

describe('getMyListings', () => {
  it('returns the data on success', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{id: '1', title: 'Tee'}],
    });

    const result = await getAllListings();
    expect(result).toEqual([{id: '1', title: 'Tee'}]);
  });

  it('throws when response is not ok', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getAllListings()).rejects.toThrow('Failed: 500');
  });
});

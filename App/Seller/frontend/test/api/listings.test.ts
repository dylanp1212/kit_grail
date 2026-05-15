import {describe, it, expect, vi} from 'vitest';
import {getAllListings, getListing,
  createNewListing} from '../../src/api/listings';

describe('getAllListings', () => {
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

describe('getListing', () => {
  it('returns data when a listing is found', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{id: '1', title: 'Fake'}],
    });

    const result = await getListing('1');
    expect(result).toEqual([{id: '1', title: 'Fake'}]);
  });

  it('throws when a listing is not found', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });
    await expect(getListing('2')).rejects.toThrow('Failed: 404');
  });
});

describe('createNewListing', () => {
  it('returns data when a listing is found', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({id: '1', title: 'Fake'}),
    });

    const result = await createNewListing({});
    expect(result).toEqual({id: '1', title: 'Fake'});
  });

  it('throws when a listing is not found', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
    });
    await expect(createNewListing({})).rejects.toThrow('Failed: 400');
  });
});

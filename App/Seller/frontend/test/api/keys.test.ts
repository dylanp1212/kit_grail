import {describe, it, expect, vi} from 'vitest';
import {createKey, listKeys, revokeKey} from '../../src/api/keys';

describe('listKeys', () => {
  it('returns keys on success', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{id: 'k1', prefix: 'kg_abcdefghij', label: 'Prod'}],
    });
    const result = await listKeys();
    expect(result[0].label).toBe('Prod');
  });

  it('throws on 401', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ok: false, status: 401});
    await expect(listKeys()).rejects.toThrow('Failed: 401');
  });
});

describe('createKey', () => {
  it('sends label in body and returns the created key', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'new-id', prefix: 'kg_x', plaintext: 'kg_secret',
        label: 'Prod', created_at: '2026-05-18T00:00:00Z',
      }),
    });
    globalThis.fetch = mockFetch;
    const result = await createKey('Prod');
    expect(result.plaintext).toBe('kg_secret');
    const [, init] = mockFetch.mock.calls[0];
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({label: 'Prod'});
  });
});

describe('revokeKey', () => {
  it('calls DELETE on the right URL', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ok: true, status: 204});
    globalThis.fetch = mockFetch;
    await revokeKey('some-id');
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('/api/v0/keys/some-id');
    expect(init.method).toBe('DELETE');
  });

  it('throws on 404', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ok: false, status: 404});
    await expect(revokeKey('missing')).rejects.toThrow('Failed: 404');
  });
});

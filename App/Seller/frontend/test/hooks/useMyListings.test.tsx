import {it, describe, expect, vi} from 'vitest';
import {renderHook, waitFor} from '@testing-library/react';

import {useMyListings} from '../../src/hooks/useMyListings';
import {getAllListings} from '../../src/api/listings';

vi.mock('../../src/api/listings', () => ({
  getAllListings: vi.fn(),
}));

const mockedGetAllListings = vi.mocked(getAllListings);

describe('useMyListings', () => {
  it('returns empty listings without calling API when user is null',
      async () => {
        const {result} = renderHook(() => useMyListings());
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(mockedGetAllListings).not.toHaveBeenCalled();
      });

  it('returns empty array when user is null', async () => {
    const {result} = renderHook(() => useMyListings());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.listings).toEqual([]);
  });
});

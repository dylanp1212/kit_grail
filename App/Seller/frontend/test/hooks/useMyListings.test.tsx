import {it, describe, expect, vi, beforeEach} from 'vitest';
import {renderHook, waitFor} from '@testing-library/react';

import {useMyListings} from '../../src/hooks/useMyListings';
import {getAllListings, type MyListing} from '../../src/api/listings';

vi.mock('../../src/api/listings', () => ({
  getAllListings: vi.fn(),
}));

const mockedGetAllListings = vi.mocked(getAllListings);

describe('useMyListings', () => {
  beforeEach(() => {
    mockedGetAllListings.mockReset();
  });

  it('calls getAllListings on mount', async () => {
    mockedGetAllListings.mockResolvedValue([]);
    const {result} = renderHook(() => useMyListings());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockedGetAllListings).toHaveBeenCalledTimes(1);
  });

  it('returns the listings on success', async () => {
    mockedGetAllListings.mockResolvedValue([{id: '1'} as MyListing]);
    const {result} = renderHook(() => useMyListings());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.listings).toHaveLength(1);
  });
});

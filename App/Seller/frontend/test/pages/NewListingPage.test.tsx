import {it, describe,
  // beforeEach, expect, vi,
} from 'vitest';
import {render,
  // screen,
} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import {NewListing} from '../../src/pages/NewListingPage';
// import {getAllListings} from '../../src/api/listings';
// import {sampleListing} from '../fixtures/listings';

// vi.mock('../../src/api/listings', () => ({
//   getAllListings: vi.fn(),
// }));

// const mockedGetAllListings = vi.mocked(getAllListings);

describe('NewListingPage', () => {
  // beforeEach(() => {
  //   mockedGetAllListings.mockReset();
  //   mockedGetAllListings.mockResolvedValue([]);
  // });

  it('render new listing page', () => {
    render(
        <MemoryRouter>
          <NewListing />
        </MemoryRouter>,
    );
  });
});

import {it, describe, beforeEach, expect} from 'vitest';
import {render, screen} from '@testing-library/react';

import {MyListings} from '../../src/pages/MyListingsPage';

describe('MyListingsPage', () => {
  beforeEach(() => {
    render(<MyListings />);
  });

  it('Page renders', () => {
    render(<MyListings />);
  });

  it('Initial render shows "My Listings"', async () => {
    render(<MyListings />);
    expect(await screen.findByText('My Listings')).toBeInTheDocument();
  });
});

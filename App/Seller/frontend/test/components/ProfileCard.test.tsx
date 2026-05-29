import {it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {SellerContext} from '../../src/context/SellerContext';
import {ProfileCard} from '../../src/components/ProfileCard';
import {fakeUser} from '../fixtures/listings';

it('shows seller name and email', () => {
  render(
      <SellerContext.Provider value={fakeUser}>
        <ProfileCard />
      </SellerContext.Provider>,
  );
  expect(screen.getByText(fakeUser.name)).toBeInTheDocument();
  expect(screen.getByText(fakeUser.email)).toBeInTheDocument();
});

it('renders without crashing when user is null', () => {
  render(
      <SellerContext.Provider value={null}>
        <ProfileCard />
      </SellerContext.Provider>,
  );
});

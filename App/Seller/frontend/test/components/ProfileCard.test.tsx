import {it, expect} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {SellerContext} from '../../src/context/SellerContext';
import {ProfileCard} from '../../src/components/ProfileCard';
import {fakeUser} from '../fixtures/listings';
import {renderWithLoginRoute} from '../fixtures/router';

const renderCard = (user = fakeUser) => renderWithLoginRoute(
    <SellerContext.Provider value={user}>
      <ProfileCard />
    </SellerContext.Provider>,
);

it('renders profile card', () => {
  renderCard();
  expect(screen.getByLabelText('profile card')).toBeInTheDocument();
});

it('renders without crashing when user is null', () => {
  renderWithLoginRoute(
      <SellerContext.Provider value={null}>
        <ProfileCard />
      </SellerContext.Provider>,
  );
});

it('navigates to profile page on click', async () => {
  renderCard();
  await userEvent.click(screen.getByLabelText('profile card'));
  expect(await screen.findByText('Profile Page')).toBeInTheDocument();
});

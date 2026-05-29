import {it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {SellerContext} from '../../src/context/SellerContext';
import {ProfilePage} from '../../src/pages/ProfilePage';
import {fakeUser} from '../fixtures/listings';

const renderProfilePage = () => render(
    <MemoryRouter>
      <SellerContext.Provider value={fakeUser}>
        <ProfilePage />
      </SellerContext.Provider>
    </MemoryRouter>,
);

it('renders user profile and shop button', () => {
  renderProfilePage();
  expect(screen.getByText(fakeUser.name)).toBeInTheDocument();
  expect(screen.getByText('Go to Shop')).toBeInTheDocument();
});

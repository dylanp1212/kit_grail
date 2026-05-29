import {it, describe, expect, vi} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {Sidebar} from '../../src/components/Sidebar';
import {SellerContext} from '../../src/context/SellerContext';
import {fakeUser} from '../fixtures/listings';
import {renderWithLoginRoute} from '../fixtures/router';

vi.mock('../../src/auth', () => ({
  signOut: vi.fn().mockResolvedValue(undefined),
}));

const renderSidebar = () => renderWithLoginRoute(
    <SellerContext.Provider value={fakeUser}>
      <Sidebar />
    </SellerContext.Provider>,
);

describe('Sidebar', () => {
  it('Sidebar renders correctly', () => {
    renderSidebar();
    expect(screen.getByLabelText('sidebar menu')).toBeInTheDocument();
  });

  it('clicking sign out navigates to login page', async () => {
    renderSidebar();
    await userEvent.click(screen.getByText(/sign.?out/i));
    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });
});

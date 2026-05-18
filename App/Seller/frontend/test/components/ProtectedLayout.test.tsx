import {it, describe, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter, Routes, Route} from 'react-router-dom';

import {ProtectedLayout} from '../../src/components/ProtectedLayout';
import {getSession} from '../../src/auth';
import {fakeUser} from '../fixtures/listings';

vi.mock('../../src/auth', () => ({
  getSession: vi.fn(),
  signOut: vi.fn(),
}));

const mockedGetSession = vi.mocked(getSession);

const renderLayout = () => render(
    <MemoryRouter>
      <Routes>
        <Route path='/' element={<ProtectedLayout />} />
        <Route path='/login' element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
);

describe('ProtectedLayout', () => {
  it('renders nothing before session resolves', () => {
    mockedGetSession.mockReturnValue(new Promise(() => {}));
    renderLayout();
    expect(screen.queryByLabelText('sidebar menu')).not.toBeInTheDocument();
  });

  it('renders sidebar after valid session', async () => {
    mockedGetSession.mockResolvedValue(fakeUser);
    renderLayout();
    expect(await screen.findByLabelText('sidebar menu')).toBeInTheDocument();
  });

  it('redirects to login page when there is no session', async () => {
    mockedGetSession.mockResolvedValue(null);
    renderLayout();
    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  it('does not render sidebar when there is no session', async () => {
    mockedGetSession.mockResolvedValue(null);
    renderLayout();
    await screen.findByText('Login Page');
    expect(screen.queryByLabelText('sidebar menu')).not.toBeInTheDocument();
  });
});

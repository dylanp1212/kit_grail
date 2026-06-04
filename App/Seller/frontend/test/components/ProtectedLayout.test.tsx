import {it, describe, expect, vi} from 'vitest';
import {screen} from '@testing-library/react';

import {ProtectedLayout} from '../../src/components/ProtectedLayout';
import {getSession} from '../../src/auth';
import {fakeUser} from '../fixtures/listings';
import {renderWithLoginRoute} from '../fixtures/router';

vi.mock('../../src/auth', () => ({
  getSession: vi.fn(),
  signOut: vi.fn(),
  getProfilePicture: vi.fn().mockResolvedValue(undefined),
}));

const mockedGetSession = vi.mocked(getSession);

const renderLayout = () => renderWithLoginRoute(<ProtectedLayout />);

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

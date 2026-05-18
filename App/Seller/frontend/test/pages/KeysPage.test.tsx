import {it, describe, beforeEach, expect, vi} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import '../../src/i18n';
import {KeysPage} from '../../src/pages/KeysPage';
import * as api from '../../src/api/keys';

vi.mock('../../src/api/keys', () => ({
  listKeys: vi.fn(),
  createKey: vi.fn(),
  revokeKey: vi.fn(),
}));

const mockedList = vi.mocked(api.listKeys);
const mockedCreate = vi.mocked(api.createKey);
const mockedRevoke = vi.mocked(api.revokeKey);

const sampleKey = {
  id: 'k1',
  prefix: 'kg_abcdefghij',
  label: 'Production',
  created_at: '2026-05-18T00:00:00Z',
};

const renderPage = () => render(
    <MemoryRouter>
      <KeysPage />
    </MemoryRouter>,
);

describe('KeysPage', () => {
  beforeEach(() => {
    mockedList.mockReset();
    mockedCreate.mockReset();
    mockedRevoke.mockReset();
    mockedList.mockResolvedValue([]);
  });

  it('renders title and Create button', async () => {
    renderPage();
    expect(await screen.findByText('API Keys')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Create Key'}))
        .toBeInTheDocument();
  });

  it('shows empty state when no keys', async () => {
    renderPage();
    expect(await screen.findByText(/No API keys yet/i)).toBeInTheDocument();
  });

  it('lists existing keys with prefix and status', async () => {
    mockedList.mockResolvedValue([sampleKey]);
    renderPage();
    expect(await screen.findByText('Production')).toBeInTheDocument();
    expect(screen.getByText('kg_abcdefghij')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows "Revoked" status for revoked keys', async () => {
    mockedList.mockResolvedValue([
      {...sampleKey, revoked_at: '2026-05-19T00:00:00Z'},
    ]);
    renderPage();
    expect(await screen.findByText('Revoked')).toBeInTheDocument();
  });

  it('shows error when list fails', async () => {
    mockedList.mockRejectedValue(new Error('Failed: 500'));
    renderPage();
    expect(await screen.findByText(/Failed: 500/i)).toBeInTheDocument();
  });

  it('opens the create dialog and submits a new key', async () => {
    mockedCreate.mockResolvedValue({
      id: 'new', prefix: 'kg_zzzzzzzzzz', plaintext: 'kg_secret',
      label: 'Staging', created_at: '2026-05-18T00:00:00Z',
    });
    renderPage();
    fireEvent.click(await screen.findByRole('button', {name: 'Create Key'}));
    const input = await screen.findByLabelText('Label');
    fireEvent.change(input, {target: {value: 'Staging'}});
    const submits = await screen.findAllByRole('button', {name: 'Create Key'});
    fireEvent.click(submits[submits.length - 1]);
    await waitFor(() => {
      expect(mockedCreate).toHaveBeenCalledWith('Staging');
    });
    expect(await screen.findByText('kg_secret')).toBeInTheDocument();
  });

  it('revokes a key after confirm', async () => {
    mockedList.mockResolvedValue([sampleKey]);
    mockedRevoke.mockResolvedValue();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderPage();
    fireEvent.click(await screen.findByLabelText('Revoke'));
    await waitFor(() => {
      expect(mockedRevoke).toHaveBeenCalledWith('k1');
    });
    confirmSpy.mockRestore();
  });

  it('does not revoke when confirm is dismissed', async () => {
    mockedList.mockResolvedValue([sampleKey]);
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderPage();
    fireEvent.click(await screen.findByLabelText('Revoke'));
    expect(mockedRevoke).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});

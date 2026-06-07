import {it, describe, beforeEach, afterEach, expect, vi} from 'vitest';
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

  it('shows "—" for missing label and missing created_at', async () => {
    mockedList.mockResolvedValue([{...sampleKey, label: null,
      created_at: null}]);
    renderPage();
    expect(await screen.findAllByText('—')).toHaveLength(2);
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

  const submitCreateDialog = async (label = 'Staging') => {
    renderPage();
    fireEvent.click(await screen.findByRole('button', {name: 'Create Key'}));
    fireEvent.change(await screen.findByLabelText('Label'),
        {target: {value: label}});
    const submits = await screen.findAllByRole('button', {name: 'Create Key'});
    fireEvent.click(submits[submits.length - 1]);
  };

  it('closes the create dialog when Cancel is clicked', async () => {
    renderPage();
    fireEvent.click(await screen.findByRole('button', {name: 'Create Key'}));
    fireEvent.click(await screen.findByRole('button', {name: 'Cancel'}));
    await waitFor(() => {
      expect(screen.queryByLabelText('Label')).not.toBeInTheDocument();
    });
  });

  it('closes the create dialog when clicking outside (onClose)', async () => {
    renderPage();
    fireEvent.click(await screen.findByRole('button', {name: 'Create Key'}));
    fireEvent.keyDown(await screen.findByRole('dialog'), {key: 'Escape'});
    await waitFor(() => {
      expect(screen.queryByLabelText('Label')).not.toBeInTheDocument();
    });
  });

  it('shows error when createKey fails', async () => {
    mockedCreate.mockRejectedValue(new Error('Create failed'));
    await submitCreateDialog();
    expect(await screen.findByText(/Create failed/i)).toBeInTheDocument();
  });

  it('opens the create dialog and submits a new key', async () => {
    mockedCreate.mockResolvedValue({
      id: 'new', prefix: 'kg_zzzzzzzzzz', plaintext: 'kg_secret',
      label: 'Staging', created_at: '2026-05-18T00:00:00Z',
    });
    await submitCreateDialog();
    await waitFor(() => {
      expect(mockedCreate).toHaveBeenCalledWith('Staging');
    });
    expect(await screen.findByText('kg_secret')).toBeInTheDocument();
  });

  it('dismisses the show-key dialog when "I saved it" is clicked', async () => {
    mockedCreate.mockResolvedValue({
      id: 'new', prefix: 'kg_zzzzzzzzzz', plaintext: 'kg_secret',
      label: 'Staging', created_at: '2026-05-18T00:00:00Z',
    });
    await submitCreateDialog();
    expect(await screen.findByText('kg_secret')).toBeInTheDocument();
    fireEvent.click(await screen.findByRole('button', {name: 'I saved it'}));
    await waitFor(() => {
      expect(screen.queryByText('kg_secret')).not.toBeInTheDocument();
    });
  });

  it('copies the plaintext key to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard',
        {value: {writeText}, configurable: true});
    mockedCreate.mockResolvedValue({
      id: 'new', prefix: 'kg_zzzzzzzzzz', plaintext: 'kg_secret',
      label: 'Staging', created_at: '2026-05-18T00:00:00Z',
    });
    await submitCreateDialog();
    fireEvent.click(await screen.findByLabelText('Copy'));
    expect(writeText).toHaveBeenCalledWith('kg_secret');
  });

  describe('when confirm is accepted', () => {
    let confirmSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
      mockedRevoke.mockResolvedValue();
      confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    });
    afterEach(() => confirmSpy.mockRestore());

    it('calls revokeKey with the key id', async () => {
      mockedList.mockResolvedValue([sampleKey]);
      renderPage();
      fireEvent.click(await screen.findByLabelText('Revoke'));
      await waitFor(() => {
        expect(mockedRevoke).toHaveBeenCalledWith('k1');
      });
    });

    it('shows error when revokeKey fails', async () => {
      mockedList.mockResolvedValue([sampleKey]);
      mockedRevoke.mockRejectedValue(new Error('Revoke failed'));
      renderPage();
      fireEvent.click(await screen.findByLabelText('Revoke'));
      expect(await screen.findByText(/Revoke failed/i)).toBeInTheDocument();
    });

    it('shows error when listKeys fails during refresh', async () => {
      mockedList.mockResolvedValueOnce([sampleKey]);
      mockedList.mockRejectedValue(new Error('Refresh failed'));
      renderPage();
      fireEvent.click(await screen.findByLabelText('Revoke'));
      expect(await screen.findByText(/Refresh failed/i)).toBeInTheDocument();
    });
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

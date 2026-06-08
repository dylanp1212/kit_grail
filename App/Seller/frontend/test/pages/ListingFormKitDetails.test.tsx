import {it, describe, expect, beforeEach, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Routes, Route} from 'react-router-dom';

import {ListingForm} from '../../src/pages/ListingForm';
import {createNewListing, getListing} from '../../src/api/listings';
import {sampleListing, fakeUser} from '../fixtures/listings';
import {SellerContext} from '../../src/context/SellerContext';

vi.mock('../../src/api/listings', () => ({
  createNewListing: vi.fn(),
  editListing: vi.fn(),
  getListing: vi.fn(),
}));

const mockedCreate = vi.mocked(createNewListing);
const mockedGetListing = vi.mocked(getListing);

const renderPage = () => render(
    <MemoryRouter>
      <SellerContext.Provider value={fakeUser}>
        <ListingForm />
      </SellerContext.Provider>
    </MemoryRouter>,
);

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => vi.fn(),
}));

/**
 *
 */
async function fillRequiredFields() {
  const title = screen.getByLabelText('title');
  await userEvent.type(title, 'Test Title');
  const description = screen.getByLabelText('description');
  await userEvent.type(description, 'Test Description');
  await userEvent.click(screen.getByLabelText('L'));
  await userEvent.click(screen.getByLabelText('blue'));
  const dollars = screen.getByLabelText('dollars');
  await userEvent.type(dollars, '100');
}

describe('ListingForm kit details (player/club/season/competition)', () => {
  beforeEach(() => {
    mockedCreate.mockReset();
    mockedGetListing.mockReset();
  });

  it('renders all four optional inputs', () => {
    renderPage();
    expect(screen.getByLabelText('player')).toBeInTheDocument();
    expect(screen.getByLabelText('club')).toBeInTheDocument();
    expect(screen.getByLabelText('season')).toBeInTheDocument();
    expect(screen.getByLabelText('competition')).toBeInTheDocument();
  });

  it('shows the optional disclaimer', () => {
    renderPage();
    expect(screen.getByText(/Optional/i)).toBeInTheDocument();
  });

  it('typing into player and submitting sends to the API', async () => {
    renderPage();
    await fillRequiredFields();
    const player = screen.getByLabelText('player');
    await userEvent.type(player, 'Zinedine Zidane');

    await userEvent.click(screen.getByLabelText('create new listing'));
    await waitFor(() => {
      expect(mockedCreate).toHaveBeenCalled();
    });
    const body = mockedCreate.mock.calls[0][0];
    expect(body.player).toBe('Zinedine Zidane');
  });

  it('typing into club/season/competition flows to API', async () => {
    renderPage();
    await fillRequiredFields();
    const clubField = screen.getByLabelText('club');
    await userEvent.type(clubField, 'Real Madrid');
    await userEvent.type(screen.getByLabelText('season'), '2001-02');
    await userEvent.type(screen.getByLabelText('competition'), 'UCL');

    await userEvent.click(screen.getByLabelText('create new listing'));
    await waitFor(() => {
      expect(mockedCreate).toHaveBeenCalled();
    });
    const body = mockedCreate.mock.calls[0][0];
    expect(body.club).toBe('Real Madrid');
    expect(body.season).toBe('2001-02');
    expect(body.competition).toBe('UCL');
  });

  it('omits the optional fields when left blank', async () => {
    renderPage();
    await fillRequiredFields();

    await userEvent.click(screen.getByLabelText('create new listing'));
    await waitFor(() => {
      expect(mockedCreate).toHaveBeenCalled();
    });
    const body = mockedCreate.mock.calls[0][0];
    expect(body.player).toBeUndefined();
    expect(body.club).toBeUndefined();
    expect(body.season).toBeUndefined();
    expect(body.competition).toBeUndefined();
  });

  it('edit flow prefills player/club/season/competition', async () => {
    mockedGetListing.mockResolvedValue({
      ...sampleListing,
      player: 'Lionel Messi',
      club: 'Argentina',
      season: '2014',
      competition: 'FIFA World Cup',
    });
    render(
        <MemoryRouter initialEntries={['/edit/abc-123']}>
          <SellerContext.Provider value={fakeUser}>
            <Routes>
              <Route path='/edit/:id' element={<ListingForm />} />
            </Routes>
          </SellerContext.Provider>
        </MemoryRouter>,
    );
    await waitFor(() => {
      expect(mockedGetListing).toHaveBeenCalled();
    });
    const player = screen.getByLabelText('player') as HTMLInputElement;
    const club = screen.getByLabelText('club') as HTMLInputElement;
    const season = screen.getByLabelText('season') as HTMLInputElement;
    const comp = screen.getByLabelText('competition') as HTMLInputElement;
    expect(player.value).toBe('Lionel Messi');
    expect(club.value).toBe('Argentina');
    expect(season.value).toBe('2014');
    expect(comp.value).toBe('FIFA World Cup');
  });
});

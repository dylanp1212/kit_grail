import {beforeEach, describe, expect, it, vi} from 'vitest';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {SellerContext} from '../../src/context/SellerContext';
import {ListingForm} from '../../src/pages/ListingForm';
import {fakeUser, sampleListing} from '../fixtures/listings';
import * as listingsApi from '../../src/api/listings';

vi.mock('../../src/api/listings', async () => {
  const a = await vi.importActual<typeof listingsApi>(
      '../../src/api/listings');
  return {
    ...a,
    createNewListing: vi.fn(),
    editListing: vi.fn(),
    getListing: vi.fn(),
  };
});
vi.mock('react-router-dom', async () => {
  type RR = typeof import('react-router-dom');
  const a = await vi.importActual<RR>('react-router-dom');
  return {...a, useNavigate: () => vi.fn()};
});

const mockedCreate = vi.mocked(listingsApi.createNewListing);
const mockedGetListing = vi.mocked(listingsApi.getListing);

/**
 *
 */
function renderNew() {
  return render(
      <MemoryRouter>
        <SellerContext.Provider value={fakeUser}>
          <ListingForm />
        </SellerContext.Provider>
      </MemoryRouter>,
  );
}

/**
 *
 * @param id
 */
function renderEdit(id = 'abc-123') {
  return render(
      <MemoryRouter initialEntries={[`/edit/${id}`]}>
        <SellerContext.Provider value={fakeUser}>
          <Routes>
            <Route path='/edit/:id' element={<ListingForm />} />
          </Routes>
        </SellerContext.Provider>
      </MemoryRouter>,
  );
}

/**
 *
 */
async function fillRequiredFields() {
  await userEvent.type(screen.getByLabelText('title'), 'Test Title');
  const desc = screen.getByLabelText('description');
  await userEvent.type(desc, 'Test Description');
  await userEvent.click(screen.getByLabelText('L'));
  await userEvent.click(screen.getByLabelText('blue'));
  await userEvent.type(screen.getByLabelText('dollars'), '100');
}

/**
 *
 */
async function submitAndGetBody() {
  await userEvent.click(screen.getByLabelText('create new listing'));
  await waitFor(() => {
    expect(mockedCreate).toHaveBeenCalled();
  });
  return mockedCreate.mock.calls[0][0];
}

describe('ListingForm kit details (player/club/season/competition)', () => {
  beforeEach(() => {
    mockedCreate.mockReset();
    mockedGetListing.mockReset();
  });

  it('renders all four optional inputs', () => {
    renderNew();
    expect(screen.getByLabelText('player')).toBeInTheDocument();
    expect(screen.getByLabelText('club')).toBeInTheDocument();
    expect(screen.getByLabelText('season')).toBeInTheDocument();
    expect(screen.getByLabelText('competition')).toBeInTheDocument();
  });

  it('shows the optional disclaimer', () => {
    renderNew();
    expect(screen.getByText(/Optional/i)).toBeInTheDocument();
  });

  it('typing into player flows to the create body', async () => {
    renderNew();
    await fillRequiredFields();
    await userEvent.type(screen.getByLabelText('player'), 'Zinedine Zidane');
    const body = await submitAndGetBody();
    expect(body.player).toBe('Zinedine Zidane');
  });

  it('typing into club/season/competition flows to body', async () => {
    renderNew();
    await fillRequiredFields();
    await userEvent.type(screen.getByLabelText('club'), 'Real Madrid');
    await userEvent.type(screen.getByLabelText('season'), '2001-02');
    await userEvent.type(screen.getByLabelText('competition'), 'UCL');
    const body = await submitAndGetBody();
    expect(body.club).toBe('Real Madrid');
    expect(body.season).toBe('2001-02');
    expect(body.competition).toBe('UCL');
  });

  it('omits optional fields when blank', async () => {
    renderNew();
    await fillRequiredFields();
    const body = await submitAndGetBody();
    expect(body.player).toBeUndefined();
    expect(body.club).toBeUndefined();
    expect(body.season).toBeUndefined();
    expect(body.competition).toBeUndefined();
  });

  it('edit flow prefills kit details', async () => {
    mockedGetListing.mockResolvedValue({
      ...sampleListing,
      player: 'Lionel Messi',
      club: 'Argentina',
      season: '2014',
      competition: 'FIFA World Cup',
    });
    renderEdit();
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

import {it, describe, expect,
  beforeEach, vi,
} from 'vitest';
import {render, screen,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';

import {NewListing} from '../../src/pages/ListingForm';
import {createNewListing} from '../../src/api/listings';
import {sampleListing, fakeUser} from '../fixtures/listings';
import {SellerContext} from '../../src/context/SellerContext';

vi.mock('../../src/api/listings', () => ({
  createNewListing: vi.fn(),
}));

const mockedCreateNewListing = vi.mocked(createNewListing);

const renderPage = () => render(
    <MemoryRouter>
      <SellerContext.Provider value={fakeUser}>
        <NewListing />
      </SellerContext.Provider>
    </MemoryRouter>,
);

describe('NewListingPage', async () => {
  beforeEach(() => {
    mockedCreateNewListing.mockReset();
    mockedCreateNewListing.mockResolvedValue(sampleListing);
  });

  it('render new listing page', async () => {
    renderPage();
  });

  it('types into title field', async () => {
    renderPage();
    const title = screen.getByLabelText('title');
    await userEvent.type(title, 'Fake Soccer Jersey');
    expect(title).toHaveValue('Fake Soccer Jersey');
  });

  it('types into description field', async () => {
    renderPage();
    const desc = screen.getByLabelText('description');
    await userEvent.type(desc, 'This is a fake soccer jersey');
    expect(desc).toHaveValue('This is a fake soccer jersey');
  });

  it('selects a size', async () => {
    renderPage();
    const xlbutton = screen.getByLabelText('XL');
    await userEvent.click(xlbutton);
    expect(xlbutton).toHaveAttribute('aria-pressed', 'true');
  });

  const renderAndClickRed = async () => {
    renderPage();
    const redbutton = screen.getByLabelText('red');
    await userEvent.click(redbutton);
    return redbutton;
  };

  it('selects a color', async () => {
    const redbutton = await renderAndClickRed();
    expect(redbutton).toHaveAttribute('aria-pressed', 'true');
  });

  it('deselects a color', async () => {
    const redbutton = await renderAndClickRed();
    await userEvent.click(redbutton);
    expect(redbutton).toHaveAttribute('aria-pressed', 'false');
  });

  it('types into image url field', async () => {
    renderPage();
    const img = screen.getByLabelText('image url');
    await userEvent.type(img, 'http://fakewebsite.com/jersey-photo');
    expect(img).toHaveValue('http://fakewebsite.com/jersey-photo');
  });

  const renderAndTypeDollars = async (input: string) => {
    renderPage();
    const dollars = screen.getByLabelText('dollars');
    await userEvent.type(dollars, input);
    return dollars;
  };

  it('types into dollars field', async () => {
    const dollars = await renderAndTypeDollars('12');
    expect(dollars).toHaveValue('12');
  });

  it('wont type non numbers into dollars field', async () => {
    const dollars = await renderAndTypeDollars('12f.-3');
    expect(dollars).toHaveValue('123');
  });

  it('types into cents field', async () => {
    renderPage();
    const cents = screen.getByLabelText('cents');
    await userEvent.clear(cents);
    await userEvent.type(cents, '12');
    expect(cents).toHaveValue('12');
  });

  it('wont type non numbers or >2 digits into cents field', async () => {
    renderPage();
    const c = screen.getByLabelText('cents');
    await userEvent.clear(c);
    await userEvent.type(c, '12f.-3');
    expect(c).toHaveValue('12');
  });

  it('pads cents field to 2 digits on click out', async () => {
    renderPage();
    const cen = screen.getByLabelText('cents');
    await userEvent.clear(cen);
    await userEvent.type(cen, '9');
    await userEvent.click(document.body);
    expect(cen).toHaveValue('09');
  });

  it('wont let you click create new button without filling in', async () => {
    renderPage();
    const create = screen.getByLabelText('create new listing');
    expect(create).toHaveAttribute('aria-pressable', 'false');
  });

  const enterInfo = async () => {
    renderPage();
    await userEvent.type(screen.getByLabelText('title'), 'Fake Soccer Jersey');
    await userEvent.type(
        screen.getByLabelText('description'), 'This is a fake soccer jersey',
    );
    await userEvent.click(screen.getByLabelText('XL'));
    await userEvent.click(screen.getByLabelText('red'));
    await userEvent.type(screen.getByLabelText('dollars'), '12');
  };

  it('lets you click create new button after filling in', async () => {
    await enterInfo();
    const create = screen.getByLabelText('create new listing');
    expect(create).toHaveAttribute('aria-pressable', 'true');
  });

  it('clears info after pressing create new', async () => {
    await enterInfo();
    fireEvent.click(screen.getByLabelText('create new listing'));
    const title = screen.getByLabelText('title');
    await vi.waitFor(() => {
      expect(title).toHaveValue('');
    });
  });

  it('clears info after pressing create new with image', async () => {
    await enterInfo();
    await userEvent.type(
        screen.getByLabelText('image url'), 'http://fakewebsite.com/jersey-photo',
    );
    fireEvent.click(screen.getByLabelText('create new listing'));
    const t = screen.getByLabelText('title');
    await vi.waitFor(() => {
      expect(t).toHaveValue('');
    });
  });

  it('doesnt lets you click create new button before filling in', async () => {
    renderPage();
    await userEvent.type(screen.getByLabelText('title'), 'Fake Soccer Jersey');
    fireEvent.click(screen.getByLabelText('create new listing'));
    expect(screen.getByLabelText('title')).toHaveValue('Fake Soccer Jersey');
  });
});

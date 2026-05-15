import {it, describe, expect,
  // beforeEach, vi,
} from 'vitest';
import {render, screen,
  // fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';

import {NewListing} from '../../src/pages/NewListingPage';
// import {getAllListings} from '../../src/api/listings';
// import {sampleListing} from '../fixtures/listings';

// vi.mock('../../src/api/listings', () => ({
//   getAllListings: vi.fn(),
// }));

// const mockedGetAllListings = vi.mocked(getAllListings);

describe('NewListingPage', async () => {
  // beforeEach(() => {
  //   mockedGetAllListings.mockReset();
  //   mockedGetAllListings.mockResolvedValue([]);
  // });

  it('render new listing page', async () => {
    render(<MemoryRouter><NewListing /></MemoryRouter>);
  });

  it('types into title field', async () => {
    render(<MemoryRouter><NewListing /></MemoryRouter>);
    const title = screen.getByLabelText('title');
    await userEvent.type(title, 'Fake Soccer Jersey');
    expect(title).toHaveValue('Fake Soccer Jersey');
  });

  it('types into description field', async () => {
    render(<MemoryRouter><NewListing /></MemoryRouter>);
    const desc = screen.getByLabelText('description');
    await userEvent.type(desc, 'This is a fake soccer jersey');
    expect(desc).toHaveValue('This is a fake soccer jersey');
  });

  it('selects a size', async () => {
    render(<MemoryRouter><NewListing /></MemoryRouter>);
    const xlbutton = screen.getByLabelText('XL');
    await userEvent.click(xlbutton);
    // console.log(xlbutton);
    expect(xlbutton).toHaveAttribute('aria-pressed', 'true');
  });

  it('selects a color', async () => {
    render(<MemoryRouter><NewListing /></MemoryRouter>);
    const redbutton = screen.getByLabelText('red');
    await userEvent.click(redbutton);
    expect(redbutton).toHaveAttribute('aria-pressed', 'true');
  });

  it('deselects a color', async () => {
    render(<MemoryRouter><NewListing /></MemoryRouter>);
    const redbutton = screen.getByLabelText('red');
    await userEvent.click(redbutton);
    await userEvent.click(redbutton);
    expect(redbutton).toHaveAttribute('aria-pressed', 'false');
  });

  it('types into image url field', async () => {
    render(<MemoryRouter><NewListing /></MemoryRouter>);
    const img = screen.getByLabelText('image url');
    await userEvent.type(img, 'http://fakewebsite.com/jersey-photo');
    expect(img).toHaveValue('http://fakewebsite.com/jersey-photo');
  });

  it('types into dollars field', async () => {
    render(<MemoryRouter><NewListing /></MemoryRouter>);
    const dollars = screen.getByLabelText('dollars');
    await userEvent.type(dollars, '12');
    expect(dollars).toHaveValue('12');
  });

  it('wont type non numbers into dollars field', async () => {
    render(<MemoryRouter><NewListing /></MemoryRouter>);
    const dollars = screen.getByLabelText('dollars');
    await userEvent.type(dollars, '12f.-3');
    expect(dollars).toHaveValue('123');
  });

  it('types into cents field', async () => {
    render(<MemoryRouter><NewListing /></MemoryRouter>);
    const cents = screen.getByLabelText('cents');
    await userEvent.clear(cents);
    await userEvent.type(cents, '12');
    expect(cents).toHaveValue('12');
  });

  it('wont type non numbers or >2 digits into cents field', async () => {
    render(<MemoryRouter><NewListing /></MemoryRouter>);
    const c = screen.getByLabelText('cents');
    await userEvent.clear(c);
    await userEvent.type(c, '12f.-3');
    expect(c).toHaveValue('12');
  });

  it('pads cents field to 2 digits on click out', async () => {
    render(<MemoryRouter><NewListing /></MemoryRouter>);
    const cen = screen.getByLabelText('cents');
    await userEvent.clear(cen);
    await userEvent.type(cen, '9');
    await userEvent.click(document.body);
    expect(cen).toHaveValue('09');
  });

  it('wont let you click create new button without filling in', async () => {
    render(<MemoryRouter><NewListing /></MemoryRouter>);
    const create = screen.getByLabelText('create new listing');
    expect(create).toHaveAttribute('aria-pressable', 'false');
  });

  it('lets you click create new button after filling in', async () => {
    render(<MemoryRouter><NewListing /></MemoryRouter>);

    const ti = screen.getByLabelText('title');
    await userEvent.type(ti, 'Fake Soccer Jersey');

    const desc = screen.getByLabelText('description');
    await userEvent.type(desc, 'This is a fake soccer jersey');

    const xlbutton = screen.getByLabelText('XL');
    await userEvent.click(xlbutton);

    const redbutton = screen.getByLabelText('red');
    await userEvent.click(redbutton);

    const dollars = screen.getByLabelText('dollars');
    await userEvent.type(dollars, '12');

    const create = screen.getByLabelText('create new listing');
    expect(create).toHaveAttribute('aria-pressable', 'true');
  });
});

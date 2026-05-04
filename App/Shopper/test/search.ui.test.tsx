import {it, expect, vi} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'
import Search from '../src/app/listings/search'
import {routerSpy} from './mockRouter';
import userEvent from '@testing-library/user-event';


it('goes to right url on enter', async () => {
  render(<Search />);
  const input = await screen.findByPlaceholderText("What are you looking for?");
  await userEvent.type(input, 'argentina messi{enter}');
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith('?search=argentina%20messi');
  });
});

it('goes to right url on press search button', async () => {
  render(<Search />);
  const input = await screen.findByPlaceholderText("What are you looking for?");
  await userEvent.type(input, 'ronaldo united');
  const search = await screen.findByLabelText('search');
  fireEvent.click(search);
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith('?search=ronaldo%20united');
  });
});

it('doesnt have clear button before typing', async () => {
  render(<Search />);
  const clear = await screen.queryByLabelText('clear search');
  expect(clear).toBeNull();
});

it('has clear button after typing', async () => {
  render(<Search />);
  const input = await screen.findByPlaceholderText("What are you looking for?");
  await userEvent.type(input, 'busquets 2008');
  const clear = await screen.findByLabelText('clear search');
  expect(clear).not.toBeNull();
});

it('clears search after pressing clear button', async () => {
  render(<Search />);
  const input = await screen.findByPlaceholderText("What are you looking for?");
  await userEvent.type(input, 'random jersey');
  const clear = await screen.findByLabelText('clear search');
  fireEvent.click(clear)
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith('?search=');
  });
});

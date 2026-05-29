import {it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {SellerContext} from '../../src/context/SellerContext';
import {ChangeProfile} from '../../src/components/ChangeProfile';
import {fakeUser} from '../fixtures/listings';

const renderChangeProfile = () => render(
    <SellerContext.Provider value={fakeUser}>
      <ChangeProfile />
    </SellerContext.Provider>,
);

it('shows user name and email', () => {
  renderChangeProfile();
  expect(screen.getByText(fakeUser.name)).toBeInTheDocument();
  expect(screen.getByText(fakeUser.email)).toBeInTheDocument();
});

it('renders url input and update button', () => {
  renderChangeProfile();
  const input = screen.getByPlaceholderText('Paste image URL here');
  const btn = screen.getByRole('button', {name: /update picture/i});
  expect(input).toBeInTheDocument();
  expect(btn).toBeInTheDocument();
});

it('shows default person icon when no url is set', () => {
  renderChangeProfile();
  expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
});

it('updates avatar src after submitting a url', async () => {
  renderChangeProfile();
  await userEvent.type(screen.getByPlaceholderText('Paste image URL here'), 'https://picsum.photos/200');
  await userEvent.click(screen.getByRole('button', {name: /update picture/i}));
  const img = screen.getByRole('img') as HTMLImageElement;
  expect(img.src).toBe('https://picsum.photos/200');
});

it('replaces avatar src when a new url is submitted', async () => {
  renderChangeProfile();
  const input = screen.getByPlaceholderText('Paste image URL here');
  await userEvent.type(input, 'https://picsum.photos/200');
  await userEvent.click(screen.getByRole('button', {name: /update picture/i}));
  await userEvent.clear(input);
  await userEvent.type(input, 'https://picsum.photos/300');
  await userEvent.click(screen.getByRole('button', {name: /update picture/i}));
  const img = screen.getByRole('img') as HTMLImageElement;
  expect(img.src).toBe('https://picsum.photos/300');
});

import {it, expect, vi, beforeEach} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import {ShopperButton} from '../../src/components/ShopperButton';

const assignSpy = vi.fn();

beforeEach(() => {
  vi.stubGlobal('location', {assign: assignSpy});
});

it('renders go to shop button', () => {
  render(<ShopperButton />);
  expect(screen.getByText('Go to Shop')).toBeInTheDocument();
});

it('navigates to shopper app on click', () => {
  render(<ShopperButton />);
  fireEvent.click(screen.getByText('Go to Shop'));
  expect(assignSpy).toHaveBeenCalledWith('https://kitgrail.com/');
});

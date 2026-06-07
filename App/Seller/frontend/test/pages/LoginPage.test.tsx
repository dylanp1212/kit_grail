import {it, describe, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import {LoginPage} from '../../src/pages/LoginPage';

describe('login page', () => {
  it('renders login page', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
  });

  it('shows suspension alert when ?error=suspended', async () => {
    render(
        <MemoryRouter initialEntries={['/?error=suspended']}>
          <LoginPage />
        </MemoryRouter>,
    );
    expect(await screen.findByText(/suspended/i)).toBeInTheDocument();
  });
});

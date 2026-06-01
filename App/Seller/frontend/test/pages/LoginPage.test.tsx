import {it, describe} from 'vitest';
import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import {LoginPage} from '../../src/pages/LoginPage';

describe('login page', () => {
  it('renders login page', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
  });
});

import {it, describe, expect} from 'vitest';
import {render, screen} from '@testing-library/react';

import {MemoryRouter} from 'react-router-dom';
import {Sidebar} from '../../src/components/Sidebar';


describe('Sidebar', () => {
  it('Sidebar renders correctly', () => {
    render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
    );
    expect(screen.getByText('Kit Grail')).toBeInTheDocument();
  });
});

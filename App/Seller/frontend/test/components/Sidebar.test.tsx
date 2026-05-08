import {it, describe, expect} from 'vitest';
import {render, screen} from '@testing-library/react';

import {Sidebar} from '../../src/components/Sidebar';


describe('Sidebar', () => {
  it('Sidebar renders correctly', () => {
    render(<Sidebar />);
    expect(screen.getByText('Kit Grail')).toBeInTheDocument();
  });
});

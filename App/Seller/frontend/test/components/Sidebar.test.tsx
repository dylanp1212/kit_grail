import {it, describe, expect} from 'vitest';
import {render, screen} from '@testing-library/react';

import App from '../../src/App';


describe('Sidebar', () => {
  it('Sidebar renders correctly', () => {
    render(<App />);
    expect(screen.getByText('Kit Grail')).toBeInTheDocument();
  });
});

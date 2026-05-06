import {it, describe} from 'vitest';
import {render} from '@testing-library/react';

import App from '../../src/App';

describe('App', () => {
  it('Base page renders', () => {
    render(<App />);
  });
});

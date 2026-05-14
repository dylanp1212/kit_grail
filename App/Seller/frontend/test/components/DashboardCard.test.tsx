import {it, describe} from 'vitest';
import {render} from '@testing-library/react';

import {DashboardCard} from '../../src/components/DashboardCard';

describe('DashboardCard', () => {
  it('Render DashboardCard', () => {
    render(<DashboardCard />);
  });
});

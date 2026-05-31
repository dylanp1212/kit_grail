import {render} from '@testing-library/react';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import type {ReactElement} from 'react';

export const renderWithLoginRoute = (element: ReactElement) => render(
    <MemoryRouter>
      <Routes>
        <Route path='/' element={element} />
        <Route path='/login' element={<div>Login Page</div>} />
        <Route path='/profile' element={<div>Profile Page</div>} />
      </Routes>
    </MemoryRouter>,
);

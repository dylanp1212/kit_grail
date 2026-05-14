import {Routes, Route, BrowserRouter} from 'react-router-dom';

import {Layout} from './components/Layout';
import {Dashboard} from './pages/Dashboard';
import {MyListings} from './pages/MyListingsPage';
import {ListingPage} from './pages/ListingPage';

import './global.css';

/**
 * @returns {import('react').ReactElement} Root component. Sets up routing.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} >
          <Route path='/' element={<Dashboard />} />
          <Route path='/inventory' element={<MyListings />}/>
          <Route path='/inventory/:id' element={<ListingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

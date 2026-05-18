import {Routes, Route, BrowserRouter} from 'react-router-dom';

import {ProtectedLayout} from './components/ProtectedLayout';
import {Dashboard} from './pages/Dashboard';
import {MyListings} from './pages/MyListingsPage';
import {ListingPage} from './pages/ListingPage';
import {NewListing} from './pages/NewListingPage';
import {LoginPage} from './pages/LoginPage';
import {OrdersPage} from './pages/OrdersPage';

import './global.css';
import './i18n';

/**
 * @returns {import('react').ReactElement} Root component. Sets up routing.
 */
function App() {
  return (
    <BrowserRouter basename="/sell">
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/inventory' element={<MyListings />}/>
          <Route path='/inventory/:id' element={<ListingPage />} />
          <Route path='/new' element={<NewListing />} />
          <Route path='/orders' element={<OrdersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

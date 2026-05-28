import {Routes, Route, BrowserRouter} from 'react-router-dom';

import {ProtectedLayout} from './components/ProtectedLayout';
import {Dashboard} from './pages/Dashboard';
import {MyListings} from './pages/MyListingsPage';
import {ListingPage} from './pages/ListingPage';
import {ListingForm} from './pages/ListingForm';
import {LoginPage} from './pages/LoginPage';
import {OrdersPage} from './pages/OrdersPage';
import {KeysPage} from './pages/KeysPage';

import './global.css';
import './i18n';
// import {EditListing} from './pages/EditListing';

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
          <Route path='/new' element={<ListingForm />} />
          <Route path='/orders' element={<OrdersPage />} />
          <Route path='/account/keys' element={<KeysPage />} />
          <Route path='/edit/:id' element={<ListingForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

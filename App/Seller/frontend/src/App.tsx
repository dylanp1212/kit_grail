import {Routes, Route, BrowserRouter} from 'react-router-dom';

import {Layout} from './components/Layout';
import {Dashboard} from './pages/Dashboard';
import {MyListings} from './pages/MyListingsPage';

import './global.css';

/**
 *
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} >
          <Route path='/' element={<Dashboard />} />
          <Route path='/inventory' element={<MyListings />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

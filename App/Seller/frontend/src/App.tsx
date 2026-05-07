import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
// import Typography from '@mui/material/Typography';
import {MyListings} from './pages/MyListingsPage';

import './global.css';
import {Sidebar} from './components/Sidebar';

/**
 *
 */
function App() {
  return (
    <Box sx={{display: 'flex', minHeight: '100vh'}}>
      <Sidebar />
      <Divider orientation='vertical' flexItem />
      <Box sx={{flex: 1}}>
        <MyListings />
      </Box>
    </Box>
  );
}

export default App;

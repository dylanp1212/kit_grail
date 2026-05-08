import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import {Outlet} from 'react-router-dom';

import {Sidebar} from './Sidebar';

export const Layout = () => {
  return (
    <Box sx={{display: 'flex', minHeight: '100vh'}}>
      <Sidebar />
      <Divider orientation='vertical' flexItem />
      <Box sx={{flex: 1}}>
        <Outlet />
      </Box>
    </Box>
  );
};

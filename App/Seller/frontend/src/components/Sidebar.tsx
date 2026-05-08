import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import Home from '@mui/icons-material/Home';
import Inventory from '@mui/icons-material/Inventory';
import LocalShipping from '@mui/icons-material/LocalShipping';
import PostAdd from '@mui/icons-material/PostAdd';

import {Link} from 'react-router';


export const Sidebar = () => {
  const SidebarDrawer = (
    <Box sx={{width: 250}} role='presentation'>
      <List>
        <ListItem sx={{ml: 2}}>
          {/* <ListItemText primary='Kit Grail'/> */}
          <Typography variant='h5'>Kit Grail</Typography>
        </ListItem>

        <Divider />

        <Link to='/' style={{textDecoration: 'none', color: 'inherit'}}>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary='Dashboard'/>
            </ListItemButton>
          </ListItem>
        </Link>

        <Link
          to='/inventory'
          style={{textDecoration: 'none', color: 'inherit'}}>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <Inventory />
              </ListItemIcon>
              <ListItemText primary='Inventory'/>
            </ListItemButton>
          </ListItem>
        </Link>

        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <LocalShipping />
            </ListItemIcon>
            <ListItemText primary='Orders'/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <PostAdd />
            </ListItemIcon>
            <ListItemText primary='New Listing'/>
          </ListItemButton>
        </ListItem>

      </List>
    </Box>
  );

  return (
    <Drawer
      variant='permanent'
      sx={{
        'width': 250,
        'flexShrink': 0,
        '& .MuiDrawer-paper': {
          width: 250,
          position: 'relative',
          bgcolor: '#E5E1D8',
          border: 'none',
          overflowX: 'hidden',
        },
      }}
    >
      {SidebarDrawer}
    </Drawer>
  );
};

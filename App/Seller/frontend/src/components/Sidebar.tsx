import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Drawer,
  Divider,
  Typography,

} from '@mui/material';

import {
  Home,
  Inventory,
  LocalShipping,
} from '@mui/icons-material';


export const Sidebar = () => {
  const SidebarDrawer = (
    <Box sx={{width: 250}} role='presentation'>
      <List>
        <ListItem sx={{ml: 2}}>
          {/* <ListItemText primary='Kit Grail'/> */}
          <Typography variant='h5'>Kit Grail</Typography>
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary='Dashboard'/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <Inventory />
            </ListItemIcon>
            <ListItemText primary='Inventory'/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <LocalShipping />
            </ListItemIcon>
            <ListItemText primary='Orders'/>
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
        },
      }}
    >
      {SidebarDrawer}
    </Drawer>
  );
};

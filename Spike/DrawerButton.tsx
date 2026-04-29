import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';


<Button onClick={toggleDrawer(true)}>
  <MenuIcon />
</Button>
<Drawer open={open} onClose={toggleDrawer(false)}>
  {DrawerList}
</Drawer>
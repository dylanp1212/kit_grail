import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DrawerButton from './DrawerButton';

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <DrawerButton />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Shop
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
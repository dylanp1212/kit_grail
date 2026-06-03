import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DrawerButton from './DrawerButton';
import ShoppingCartButton from './ShoppingCartButton';

export default function ButtonAppBar({title}: {title: string}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="transparent" sx={{ bgcolor: '#F2E8D5', boxShadow: 'none', borderBottom: '1px solid #c2c9bb' }}>
        <Toolbar>
          <DrawerButton />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontFamily: '"Lexend", sans-serif', fontWeight: 600, letterSpacing: '-0.01em', color: '#154212' }}
          >
            {title}
          </Typography>
          <ShoppingCartButton />
        </Toolbar>
      </AppBar>
      <Toolbar></Toolbar>
    </Box>
  );
}

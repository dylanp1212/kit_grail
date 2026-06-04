import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DrawerButton from './DrawerButton';
import ShoppingCartButton from './ShoppingCartButton';
import Search from '../app/listings/search';

export default function ButtonAppBar({title, showSearch = false}: {title: string, showSearch?: boolean}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="transparent" sx={{ bgcolor: '#F2E8D5', boxShadow: 'none', borderBottom: '1px solid #c2c9bb' }}>
        <Toolbar sx={{ gap: 2, py: 1 }}>
          <DrawerButton />
          <Typography
            variant="h6"
            component="div"
            sx={{ fontFamily: '"Lexend", sans-serif', fontWeight: 600, letterSpacing: '-0.01em', color: '#154212' }}
          >
            {title}
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            {showSearch && (
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Search />
              </Box>
            )}
          </Box>
          <ShoppingCartButton />
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ py: 1 }}></Toolbar>
      {showSearch && (
        <Box sx={{ display: { xs: 'block', md: 'none' }, px: 2, mt: 2, mb: 1 }}>
          <Search />
        </Box>
      )}
    </Box>
  );
}

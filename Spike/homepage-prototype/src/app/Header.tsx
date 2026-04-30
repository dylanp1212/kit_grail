import { Menu, Search, ShoppingCart } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";

export default function Header() {
  return (
    <Box sx={{width: '100%'}}>
      <AppBar position="fixed" sx={{ bgcolor: '#f2e8d5', color: 'text.primary' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>

          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Project
          </Typography>

          <IconButton
            size="large"
            color="inherit"
            aria-label="search"
          >
            <Search />
          </IconButton>

          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="shopping cart"
          >
            <ShoppingCart />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
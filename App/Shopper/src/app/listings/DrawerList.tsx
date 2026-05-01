import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HelpIcon from '@mui/icons-material/Help';
import SignoutButton from './SignoutButton';
import ProfileCard from './ProfileCard';

const iconSx = { color: '#42493e', minWidth: 40 };
const btnSx = { borderRadius: '4px', '&:hover': { bgcolor: '#eeeeea' } };
const textSlotProps = { primary: { sx: { fontFamily: '"Work Sans", sans-serif', color: '#1a1c1a', fontSize: '0.9375rem' } } };

export default function DrawerList() {
  return (
    <Box sx={{ width: 250 }} role="presentation">
      <ProfileCard />
      <List sx={{ p: 1 }}>
        <ListItemButton sx={btnSx}>
          <ListItemIcon sx={iconSx}><StorefrontIcon /></ListItemIcon>
          <ListItemText primary="Shop" slotProps={textSlotProps} />
        </ListItemButton>
        <ListItemButton sx={btnSx}>
          <ListItemIcon sx={iconSx}><FavoriteIcon /></ListItemIcon>
          <ListItemText primary="Wishlist" slotProps={textSlotProps} />
        </ListItemButton>
        <ListItemButton sx={btnSx}>
          <ListItemIcon sx={iconSx}><ReceiptLongIcon /></ListItemIcon>
          <ListItemText primary="My Orders" slotProps={textSlotProps} />
        </ListItemButton>
        <ListItemButton sx={btnSx}>
          <ListItemIcon sx={iconSx}><PersonIcon /></ListItemIcon>
          <ListItemText primary="Profile" slotProps={textSlotProps} />
        </ListItemButton>
        <Divider sx={{ my: 1, borderColor: '#c2c9bb' }} />
        <ListItemButton sx={btnSx}>
          <ListItemIcon sx={iconSx}><LocalOfferIcon /></ListItemIcon>
          <ListItemText primary="Offers Made" slotProps={textSlotProps} />
        </ListItemButton>
        <ListItemButton sx={btnSx}>
          <ListItemIcon sx={iconSx}><HelpIcon /></ListItemIcon>
          <ListItemText primary="Help and Support" slotProps={textSlotProps} />
        </ListItemButton>
        <Divider sx={{ my: 2, visibility: 'hidden' }} />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <SignoutButton />
        </Box>
      </List>
    </Box>
  );
}

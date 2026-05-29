import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import {ChangeProfile} from '../components/ChangeProfile';
import {ShopperButton} from '../components/ShopperButton';

export const ProfilePage = () => {
  return (
    <Box sx={{
      maxWidth: 480,
      mx: 'auto',
      mt: 4,
      px: 3,
      pb: 6,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <ChangeProfile />
      <Divider sx={{borderColor: '#c2c9bb'}} />
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
        <Box sx={{
          fontFamily: '"Work Sans", sans-serif',
          fontWeight: 600,
          fontSize: '0.9rem',
          color: '#1a1c1a',
        }}>
          Shop on KitSwap
        </Box>
        <Box sx={{
          fontFamily: '"Work Sans", sans-serif',
          fontSize: '0.85rem',
          color: '#42493e',
          mb: 1,
        }}>
          Browse listings and manage your orders in the shopper app.
        </Box>
        <ShopperButton />
      </Box>
    </Box>
  );
};

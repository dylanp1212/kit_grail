import {redirect} from 'next/navigation';
import TopBar from '../../components/TopBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ChangeProfile from './ChangeProfile';
import SellerButton from './SellerButton';
import {getSessionUser} from '../../auth/actions';

export default async function Page() {
  const user = await getSessionUser()
  if (!user) redirect('/login')
  return (
    <main>
      <TopBar title="Profile" />
      <Box
        sx={{
          maxWidth: 480,
          mx: 'auto',
          mt: 4,
          px: 3,
          pb: 6,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <ChangeProfile />
        <Divider sx={{ borderColor: '#c2c9bb' }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#1a1c1a' }}>
            Sell on Kit Grail
          </Box>
          <Box sx={{ fontFamily: '"Work Sans", sans-serif', fontSize: '0.85rem', color: '#42493e', mb: 1 }}>
            List your kits and manage orders in the seller portal.
          </Box>
          <SellerButton />
        </Box>
      </Box>
    </main>
  );
}

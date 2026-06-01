export const dynamic = 'force-dynamic'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TopBar from '../../components/topBar';
import { getAllSellers } from '../../sellers/actions';
import SuspendButton from './SuspendButton';

export default async function SellersPage() {
  const sellers = await getAllSellers();

  return (
    <Box>
      <TopBar title='Kit Grail Admin Portal' />
      <Box sx={{ p: 3 }}>
        <Typography variant='h5' sx={{ color: '#154212', fontWeight: 600, mb: 3 }}>
          Sellers
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sellers.map((seller) => (
            <Box
              key={seller.id}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                border: '1px solid #c2c9bb', borderRadius: '4px', p: 2,
              }}
            >
              <Box>
                <Typography variant='body1' sx={{ fontWeight: 600 }}>
                  {seller.name}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {seller.email}
                </Typography>
              </Box>
              <SuspendButton id={seller.id} suspended={seller.suspended} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

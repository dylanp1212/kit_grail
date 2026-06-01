import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TopBar from '../../components/topBar';
import { getAllSellers, setSuspended } from '../../sellers/actions';

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
              <form action={async () => {
                'use server'
                await setSuspended(seller.id, !seller.suspended)
              }}>
                <button
                  type='submit'
                  style={{
                    cursor: 'pointer',
                    padding: '6px 16px',
                    border: `2px solid ${seller.suspended ? '#154212' : '#93000a'}`,
                    borderRadius: '4px',
                    background: 'transparent',
                    color: seller.suspended ? '#154212' : '#93000a',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                  }}
                >
                  {seller.suspended ? 'Unsuspend' : 'Suspend'}
                </button>
              </form>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

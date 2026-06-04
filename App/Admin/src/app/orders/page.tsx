export const dynamic = 'force-dynamic'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TopBar from '../../components/topBar';
import {getAllOrders} from '../../orders/actions';

export default async function Page() {
  const orders = await getAllOrders();

  return (
    <Box>
      <TopBar title='Kit Grail Admin Portal' />
      <Box sx={{ p: 3 }}>
        <Typography variant='h5' sx={{ color: '#154212', fontWeight: 600, mb: 3 }}>
          All Orders
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {orders.map((o) => (
            <Box key={o.id} sx={{ border: '1px solid #c2c9bb', borderRadius: '4px', p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                <Box>
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>
                    {o.shopper_name}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {o.shopper_email}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                    {o.status}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {o.paid_at ? new Date(o.paid_at).toLocaleDateString() : '—'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1}}>
                {o.items.map((item, i) => (
                  <Box key={i} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <Box>
                      <Typography variant='body2'>{item.title}</Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {item.seller_name} · {item.seller_email}
                      </Typography>
                    </Box>
                    <Typography variant='body2' color='text.secondary' sx={{ ml: 2, whiteSpace: 'nowrap' }}>
                      ${item.price.toFixed(2)}
                    </Typography>
                  </Box>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5, borderTop: '1px solid #c2c9bb', pt: 0.5 }}>
                  <Typography variant='body2' sx={{ fontWeight: 700 }}>
                    Total: ${o.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

import TopBar from '../../components/TopBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { getMyOrdersAction } from '../../checkout/actions'
import { getTranslations } from 'next-intl/server';

export default async function OrdersPage() {
  const orders = await getMyOrdersAction()
  const t = await getTranslations('Order')
  console.log('orders page: fetched', orders.length, 'orders', JSON.stringify(orders))
  return (
    <main>
      <TopBar title={t('title')} />
      <Box sx={{ mt: 2, px: { xs: '10px', md: 4 }, maxWidth: { xs: '100%', md: 800 }, mx: 'auto' }}>
        {orders.length === 0 ? (
          <Typography color='text.secondary' sx={{ mt: 4, textAlign: 'center' }}>
            {t('noOrder')}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {orders.map((order) => (
              <Box
                key={order.id}
                sx={{ border: '1px solid #c2c9bb', borderRadius: '4px', p: 2 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant='body2' color='text.secondary'>
                    {new Date(order.paid_at).toLocaleDateString()}
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ textTransform: 'capitalize' }}>
                    {order.status}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {order.items.map((item) => (
                    <Box
                      key={item.id}
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant='body1'>{item.title}</Typography>
                      <Typography variant='body1'>${item.price.toFixed(2)}</Typography>
                    </Box>
                  ))}
                </Box>
                <Typography variant='body2' sx={{ mt: 1, fontWeight: 600, textAlign: 'right' }}>
                  {t('total')}: ${order.items.reduce((sum, i) => sum + i.price, 0).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </main>
  )
}

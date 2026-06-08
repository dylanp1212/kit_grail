import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import {useTranslation} from 'react-i18next';

import {useOrders} from '../hooks/useOrders';
import {LoadingError} from '../components/LoadingError';
import type {SellerOrder} from '../api/orders';

const statusColor = (s: string): 'success' | 'warning' | 'default' => {
  if (s === 'paid') return 'success';
  if (s === 'pending') return 'warning';
  return 'default';
};

const orderTotal = (o: SellerOrder): number =>
  o.items.reduce((sum, it) => sum + (it.price ?? 0), 0);

/**
 * @returns {import('react').ReactElement} The Orders page.
 */
export function OrdersPage() {
  const {t} = useTranslation();
  const {orders, loading, error} = useOrders();

  return (
    <Box sx={{p: 3}}>
      <Typography variant="h3">{t('orders')}</Typography>
      <LoadingError loading={loading} error={error} />
      {!loading && !error && orders.length === 0 && (
        <Typography sx={{mt: 2}}>{t('noOrdersYet')}</Typography>
      )}
      {!loading && !error && orders.map((order) => (
        <Box
          key={order.id}
          sx={{mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 1}}
        >
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 1,
          }}>
            <Box>
              <Typography variant="subtitle1">
                {order.shopper_name ?? t('orderShopperUnknown')}
              </Typography>
              {order.shopper_email && (
                <Typography variant="body2" color="text.secondary">
                  {order.shopper_email}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                {new Date(order.paid_at).toLocaleString()}
                {' · #'}{order.id.slice(0, 8)}
              </Typography>
            </Box>
            <Chip
              size="small"
              label={t(`orderStatus_${order.status}`, {
                defaultValue: order.status,
              })}
              color={statusColor(order.status)}
            />
          </Box>
          {order.shipping?.address && (
            <Box sx={{mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1}}>
              <Typography variant="caption" color="text.secondary">
                {t('shipTo', {defaultValue: 'Ship to'})}
              </Typography>
              <Typography variant="body2">{order.shipping.name}</Typography>
              <Typography variant="body2">
                {order.shipping.address.line1}
                {order.shipping.address.line2 ? `, ${order.shipping.address.line2}` : ''}
              </Typography>
              <Typography variant="body2">
                {order.shipping.address.city}, {order.shipping.address.state} {order.shipping.address.postal_code}
              </Typography>
              <Typography variant="body2">{order.shipping.address.country}</Typography>
            </Box>
          )}
          <Divider sx={{my: 1}} />
          {order.items.map((item) => (
            <Box
              key={item.id}
              sx={{display: 'flex', justifyContent: 'space-between', mt: 1}}
            >
              <Typography>{item.title}</Typography>
              <Typography>${(item.price ?? 0).toFixed(2)}</Typography>
            </Box>
          ))}
          <Divider sx={{my: 1}} />
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant="subtitle2">{t('orderTotal')}</Typography>
            <Typography variant="subtitle2">
              ${orderTotal(order).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import {useOrders} from '../hooks/useOrders';
import {LoadingError} from '../components/LoadingError';

/**
 * @returns {import('react').ReactElement} The Orders page.
 */
export function OrdersPage() {
  const {orders, loading, error} = useOrders();

  return (
    <Box sx={{p: 3}}>
      <Typography variant="h3">Orders</Typography>
      <LoadingError loading={loading} error={error} />
      {!loading && !error && orders.length === 0 && (
        <Typography>No orders yet.</Typography>
      )}
      {!loading && !error && orders.map((order) => (
        <Box
          key={order.id}
          sx={{mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 1}}
        >
          <Typography variant="subtitle2" color="text.secondary">
            {new Date(order.paid_at).toLocaleDateString()}
          </Typography>
          <Divider sx={{my: 1}} />
          {order.items.map((item) => (
            <Box
              key={item.id}
              sx={{display: 'flex', justifyContent: 'space-between', mt: 1}}
            >
              <Typography>{item.title}</Typography>
              <Typography>${item.price.toFixed(2)}</Typography>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

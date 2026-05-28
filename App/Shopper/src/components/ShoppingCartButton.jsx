'use client'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { useRouter } from 'next/navigation';

const btnSx = { borderRadius: '4px', '&:hover': { bgcolor: '#eeeeea' } };

export default function ShoppingCartButton({ count = 0 }) {
  const router = useRouter();
  return (
    <IconButton sx={btnSx} onClick={() => { router.push('/shoppingcart'); }}
      aria-label={'open shopping cart'}>
      <Badge badgeContent={count} color="error">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
}

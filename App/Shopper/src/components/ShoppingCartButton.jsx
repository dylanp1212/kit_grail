'use client'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';

const btnSx = { borderRadius: '4px', '&:hover': { bgcolor: '#eeeeea' } };

export default function ShoppingCartButton() {
  const router = useRouter();
  return (
    <IconButton sx={btnSx} onClick={() => { router.push('/shoppingcart'); }}>
    
      <ShoppingCartIcon />
    </IconButton>
  );
}

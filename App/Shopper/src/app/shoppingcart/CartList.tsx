'use client'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useState, useEffect} from 'react';
import { CartItem } from '@/shoppingcart';
import {getAllCartItems, removeFromCart} from '../../shoppingcart/actions';
import CartListItem from './CartItem';


export default function CartList() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    const getItems = async (): Promise<void> => {
      const i = await getAllCartItems();
      setItems(i);
    }
    void getItems();
  }, [])

  const handleRemove = async (listingid: string): Promise<void> => {
    await removeFromCart(listingid)
    setItems(prev => prev.filter(item => item.id !== listingid))
  }

  // calculate total price
  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <Box>
      {items.length === 0 ? (
        <Typography sx={{textAlign: 'center', color: '#5f5e5a', mt: 4}}>
          Your shopping cart is empty
        </Typography>
      ) : (
        <>
          <Box sx={{width: '100%', display: 'flex', flexWrap: 'wrap',
            columnGap: '4%', rowGap: '10px'}}>
            {items.map((k) => (
              <Box key={k.id} sx={{width: '100%'}}>
                <CartListItem item={k} onRemove={() => { void handleRemove(k.id) }} />
              </Box>
            ))}
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2, px: 1}}>
            <Typography sx={{fontWeight: 700, fontSize: '18px'}}>Total</Typography>
            <Typography sx={{fontWeight: 700, fontSize: '18px'}}>${total.toFixed(2)}</Typography>
          </Box>
        </>
      )}
    </Box>
  );
}

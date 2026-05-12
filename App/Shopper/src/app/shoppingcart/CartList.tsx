'use client'
import Box from '@mui/material/Box';
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

  return (
    <Box>
      <Box sx={{width: '100%', display: 'flex', flexWrap: 'wrap',
        columnGap: '4%', rowGap: '10px'}}>
        {items.map((k) => (
          <Box key={k.id} sx={{width: '100%'}}>
            <CartListItem item={k} onRemove={() => { void handleRemove(k.id) }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

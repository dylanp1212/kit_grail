'use client'
import Box from '@mui/material/Box';
import {useState, useEffect} from 'react';
import { CartItem } from '@/shoppingcart';
import {getAllCartItems, removeFromCart} from '../../shoppingcart/actions';
import CartListItem from './CartItem';


export default function CartList() {
  // #######
  // need to change the below to actually get user id from cookie once
  // auth is implemented
  const userid = 'e86405c1-545b-4bef-912c-a9b01ee6d18f'
  // (is Sally Shopper rn)
  // #######
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    const getItems = async (): Promise<void> => {
      const i = await getAllCartItems(userid);
      setItems(i);
    }
    void getItems();
  }, [])

  // onRemove filter to remove deleted item from state
  const handleRemove = async (listingid: string): Promise<void> => {
    await removeFromCart(listingid, userid)
    setItems(prev => prev.filter(item => item.id !== listingid))
  }

  return (
    <Box>
      <Box sx={{width: '100%', display: 'flex', flexWrap: 'wrap',
        columnGap: '4%', rowGap: '10px'}}>
        {items.map((k) => (
          <Box key={k.id} sx={{width: '100%'}}>
            <CartListItem item={k} onRemove={handleRemove} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
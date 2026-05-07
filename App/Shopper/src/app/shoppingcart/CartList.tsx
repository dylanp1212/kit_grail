'use client'
import Box from '@mui/material/Box';
import {useState, useEffect} from 'react';
import { CartItem } from '@/shoppingcart';
import {getAllCartItems, removeFromCart} from '../../shoppingcart/actions';
import CartListItem from './CartItem';
import {getKitListingById} from '../../kit_listing/actions';


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
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (userid) {
        const i = await getAllCartItems(userid);
        setItems(i);
      } else {
        // guest user, get cart from local storage
        const ids = JSON.parse(localStorage.getItem('cart') ?? '[]') as string[]
        const i = await Promise.all(ids.map(id => getKitListingById(id)))
        // handle null case where listing was deleted after being added to cart
        setItems(i.filter(x => x !== null))
      }
    }
    void getItems();
  }, [])

  // onRemove filter to remove deleted item from state
  const handleRemove = async (listingid: string): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (userid) {
      await removeFromCart(listingid, userid)
    } else {
      // if guest user, remove from local storage cart
      const cart = localStorage.getItem('cart') ?? '[]'
      localStorage.setItem('cart', JSON.stringify((JSON.parse(cart) as string[]).filter(id => id !== listingid)))
    }
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
'use client'
// need use client to use useEffect
import Box from '@mui/material/Box';
import {WishlistItem} from '../../wishlist';
import WishListItem from './wishListItem';
import {getAllWishlistItems} from '../../wishlist/actions';
import {useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';


export default function WishList() {
  // #######
  // need to change the below to actually get user id from cookie once
  // auth is implemented
  const userid = 'e86405c1-545b-4bef-912c-a9b01ee6d18f'
  // (is Sally Shopper rn)
  // #######
  const empty: WishlistItem[] = [];
  const [items, setItems] = useState(empty);
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? undefined;
  useEffect(() => {
    const getItems = async (): Promise<void> => {
      const i = await getAllWishlistItems(userid, search);
      setItems(i);
    }
    void getItems();
  }, [search])
  return (
    <Box>
      <Box sx={{width: '100%', display: 'flex', flexWrap: 'wrap',
        columnGap: '4%', rowGap: '10px'}}>
        {items.map((k) => (
          <Box key={k.id} sx={{width: '100%'}}>
            <WishListItem item={k} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
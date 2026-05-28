'use client'
// need use client to use useEffect
import Box from '@mui/material/Box';
import {WishlistItem} from '../../wishlist';
import WishListItem from './wishListItem';
import {getAllWishlistItems} from '../../wishlist/actions';
import {useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import NoSearchResults from '../../components/noSearchResults';


export default function WishList() {
  const empty: WishlistItem[] = [];
  const [items, setItems] = useState(empty);
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? undefined;
  useEffect(() => {
    const getItems = async (): Promise<void> => {
      const i = await getAllWishlistItems(search);
      setItems(i);
    }
    void getItems();
  }, [search])
  return (
    <Box sx={{px: '10px'}}>
      <Box sx={{width: '100%', display: 'flex', flexWrap: 'wrap',
        columnGap: '4%', rowGap: '10px'}}>
        {items.map((k) => (
          <Box key={k.id} sx={{width: '100%'}}>
            <WishListItem item={k} onRemove={() => { setItems(prev => prev.filter(i => i.id !== k.id)); }} />
          </Box>
        ))}
      </Box>
      {items.length > 0 ? '' : <NoSearchResults />}
    </Box>
  );
}
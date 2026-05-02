import Box from '@mui/material/Box';
import {KitListing} from '../kit_listing';
import KitListItem from './kitListItem';
import {getAllKitListings} from '../kit_listing/actions';
import {useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';


export default function KitList() {
  const empty: KitListing[] = [];
  const [listings, setListings] = useState(empty);
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? undefined;
  useEffect(() => {
    const getListings = async (): Promise<void> => {
      const l = await getAllKitListings(search);
      setListings(l);
    }
    void getListings();
  }, [search])
  return (
    <Box>
      <Box sx={{width: '100%', display: 'flex', flexWrap: 'wrap',
        columnGap: '4%', rowGap: '10px'}}>
        {listings.map((k) => (
          <Box key={k.id} sx={{width: '48%'}}>
            <KitListItem listing={k} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
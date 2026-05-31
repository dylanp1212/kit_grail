'use client'
// need use client to use useEffect
import Box from '@mui/material/Box';
import {KitListing, Size} from '../../kit_listing';
import KitListItem from './kitListItem';
import {getAllKitListings} from '../../kit_listing/actions';
import {useState, useEffect, useRef} from 'react';
import {useSearchParams} from 'next/navigation';
import NoSearchResults from '../../components/noSearchResults';
import {Sort} from './sort';
import Filters from '../../components/filters'


export default function KitList() {
  const empty: KitListing[] = [];
  const [listings, setListings] = useState(empty);
  const [displayed, setDisplayed] = useState(empty);
  const [containerWidth, setContainerWidth] = useState(0);
  const [sizes, setSizes] = useState<Size[]>([])
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? undefined;

  useEffect(() => {
    const getListings = async (): Promise<void> => {
      const options = sizes.length > 0 ? {sizes} : undefined;
      const l = await getAllKitListings(search, undefined, options);
      setListings(l);
      setDisplayed(l);
    }
    void getListings();
  }, [search, sizes])

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    }
  }, []);

  let listingsPerRow = 2;
  if (containerWidth > 1000) {
    listingsPerRow = 5;
  } else if (containerWidth > 720) {
    listingsPerRow = 4;
  } else if (containerWidth > 558) {
    listingsPerRow = 3;
  } else if (containerWidth < 300 && containerWidth > 0) {
    listingsPerRow = 1;
  }

  return (
    <Box sx={{px: '10px'}} ref={containerRef}>
      <Sort listings={listings} onSort={setDisplayed} />
      <Filters setSizes={setSizes} />
      <Box sx={{width: '100%', display: 'flex', flexWrap: 'wrap',
        columnGap: '10px', rowGap: '10px'}}>
        {displayed.map((k) => (
          <Box key={k.id} sx={{width: `calc((100% - (10px * (${String(listingsPerRow)} - 1))) / ${String(listingsPerRow)})`}}>
            <KitListItem listing={k} />
          </Box>
        ))}
      </Box>
      {displayed.length > 0 ? '' : <NoSearchResults />}
    </Box>
  );
}
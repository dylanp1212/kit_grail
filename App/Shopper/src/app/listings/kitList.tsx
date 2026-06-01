'use client'
// need use client to use useEffect
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TuneIcon from '@mui/icons-material/Tune';
import {KitListing, Size} from '../../kit_listing';
import KitListItem from './kitListItem';
import {getAllKitListings} from '../../kit_listing/actions';
import {useState, useEffect, useRef} from 'react';
import {useSearchParams} from 'next/navigation';
import NoSearchResults from '../../components/noSearchResults';
import {Sort, sortListings, SortOption} from './sort';
import Filters from '../../components/filters'
import Search from './search'


export default function KitList() {
  const empty: KitListing[] = [];
  const [listings, setListings] = useState(empty);
  const [displayed, setDisplayed] = useState(empty);
  const [containerWidth, setContainerWidth] = useState(0);
  const [sizes, setSizes] = useState<Size[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption | null>(null)
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? undefined;

  useEffect(() => {
    const getListings = async (): Promise<void> => {
      const options = (sizes.length > 0 || colors.length > 0)
        ? {sizes: sizes.length > 0 ? sizes : undefined, colors: colors.length > 0 ? colors : undefined}
        : undefined;
      const l = await getAllKitListings(search, undefined, options);
      setListings(l);
      setDisplayed(sortOption ? sortListings(l, sortOption) : l);
    }
    void getListings();
    // had to disable linter for the following line because it was flagging
    // sortOption has a missing dep, but adding it would make it refetch
    // all kits every time user sorted instead of local sorting
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sizes, colors])

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    }
  }, []);

  const wideMode = containerWidth >= 750
  const listingsAreaWidth = wideMode ? containerWidth - 375 - 10 : containerWidth

  let listingsPerRow = 2;
  if (listingsAreaWidth > 1000) {
    listingsPerRow = 5;
  } else if (listingsAreaWidth > 720) {
    listingsPerRow = 4;
  } else if (listingsAreaWidth > 558) {
    listingsPerRow = 3;
  } else if (listingsAreaWidth < 300 && listingsAreaWidth > 0) {
    listingsPerRow = 1;
  }

  const listingsGrid = (
    <Box sx={{width: '100%', display: 'flex', flexWrap: 'wrap',
      columnGap: '10px', rowGap: '10px', py: '15px'}}>
      {displayed.map((k) => (
        <Box key={k.id} sx={{width: `calc((100% - (10px * (${String(listingsPerRow)} - 1))) / ${String(listingsPerRow)})`}}>
          <KitListItem listing={k} />
        </Box>
      ))}
    </Box>
  )

  return (
    <Box sx={{px: '10px'}} ref={containerRef}>
      {wideMode ? (
        <Box sx={{display: 'flex', gap: '10px', alignItems: 'flex-start'}}>
          <Box sx={{
            width: 375,
            flexShrink: 0,
            position: 'sticky',
            top: 64,
            height: 'calc(100vh - 64px)',
            overflow: 'hidden',
          }}>
            <Box sx={{mt: 2, mb: 1}}><Search /></Box>
            <Sort listings={listings} onSort={setDisplayed} onSortSelect={setSortOption} />
            <Filters setSizes={setSizes} setColors={setColors} />
          </Box>
          <Box sx={{flex: 1}}>
            {listingsGrid}
            {displayed.length > 0 ? '' : <NoSearchResults />}
          </Box>
        </Box>
      ) : (
        <>
          <Box sx={{mt: 2, mb: 1}}><Search /></Box>
          <Box sx={{display: 'flex'}}>
            <Sort listings={listings} onSort={setDisplayed} onSortSelect={setSortOption} />
            <Button
              aria-label={showFilters ? 'hide filters' : 'show filters'} variant='outlined' startIcon={<TuneIcon />}
              onClick={() => { setShowFilters(!showFilters); }}
              sx={{color: '#154212', borderColor: '#154212', fontFamily: '"Work Sans", sans-serif',
                textTransform: 'none', mb: 1, '&:hover': {bgcolor: '#f0ebe0', borderColor: '#154212'},
                ml: '10px'}}
            >
              Filters
            </Button>
          </Box>
          <Box sx={{display: showFilters ? 'block' : 'none'}}>
            <Filters setSizes={setSizes} setColors={setColors} />
          </Box>
          {listingsGrid}
          {displayed.length > 0 ? '' : <NoSearchResults />}
        </>
      )}
    </Box>
  );
}

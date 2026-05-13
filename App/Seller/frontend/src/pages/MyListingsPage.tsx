import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {ListingCard} from '../components/ListingCard';
import {useMyListings} from '../hooks/useMyListings';
import {LoadingError} from '../components/LoadingError';


/**
 * @returns {import('react').ReactElement} The My Listings page.
 */
export function MyListings() {
  const {listings, loading, error} = useMyListings();

  return (
    <Box
      sx={{p: 3}}
    >
      <Typography variant="h3">My Listings</Typography>

      <LoadingError loading={loading} error={error} />
      {!loading && !error && listings.length === 0 && (
        <Typography>No listings yet.</Typography>
      )}

      {!loading && !error && listings.length > 0 && (
        <ListingCard listings={listings} />
      )}
    </Box>
  );
}

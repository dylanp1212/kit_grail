import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {ListingCard} from '../components/ListingCard';
import {useMyListings} from '../hooks/useMyListings';


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

      {loading && (
        <Typography sx={{textAlign: 'center'}}>Loading...</Typography>
      )}
      {error && (
        <Typography color="error" sx={{textAlign: 'center'}}>
          Error: {error}
        </Typography>
      )}
      {!loading && !error && listings.length === 0 && (
        <Typography>No listings yet.</Typography>
      )}

      {!loading && !error && listings.length > 0 && (
        <ListingCard listings={listings} />
      )}
    </Box>
  );
}

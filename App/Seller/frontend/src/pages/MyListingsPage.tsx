import {useState, useEffect} from 'react';
import {getMyListings, type MyListing} from '../api/listings';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {ListingCard} from '../components/ListingCard';

/**
 *
 */
export function MyListings() {
  const [listings, setListings] = useState<MyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyListings()
        .then((data) => {
          // console.log('listings:', data);
          setListings(data);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h4">My Listings</Typography>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">Error: {error}</Typography>}
      {!loading && !error && listings.length === 0 && (
        <Typography>No listings yet.</Typography>
      )}

      {!loading && !error && listings.length > 0 && (
        <ListingCard listings={listings} />
      )}
    </Box>
  );
}

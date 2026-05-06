import {useState, useEffect} from 'react';
import {getMyListings, type MyListing} from '../api/listings';
import {Box, Typography} from '@mui/material';
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
    console.log('listings:', listings);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (listings.length === 0) return <p>No listings yet.</p>;

  return (
    <Box>
      <Typography variant='h4'>My Listings</Typography>
      <ListingCard listings={listings}/>
    </Box>
  );
}

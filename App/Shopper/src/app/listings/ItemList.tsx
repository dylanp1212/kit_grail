import { Box } from '@mui/material';
import { getAllListings } from './actions';
import ListingCard from './ListingCard';

export default async function ItemList() {
  const listings = await getAllListings();
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 2,
        p: 2,
      }}
    >
      {listings.map((listing, index) => (
        <ListingCard key={index} listing={listing} />
      ))}
    </Box>
  );
}

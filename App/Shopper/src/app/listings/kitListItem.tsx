'use client'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddToCartButton from '../../components/AddToCartButton';
import {useRouter} from 'next/navigation';
import {KitListing} from '../../kit_listing';
import {sizeToSymbol} from './helperFuncs';
import ListingImage from '../../components/ListingImage';
import WishlistButton from '../../components/wishlistButton';


export default function KitListItem(
  { listing }: { listing: KitListing }) {
  const router = useRouter();
  return(
    // added function below to route to listing detail page
    <Box onClick={() => { router.push(`/viewlisting?id=${listing.id}`); }}
      sx={{borderRadius: '10px', border: '1px solid #b3b2ae', cursor: 'pointer',
      overflow: 'hidden', width: '100%', position: 'relative'}}>
        {/* extracted ListingImage to components since im gonna reuse it a lot */}
        <ListingImage src={listing.image} alt={listing.title} />
      <WishlistButton listingid={listing.id} />
      <Box sx={{px: '10px', py: '10px'}}>
        <Typography sx={{fontSize: '12px',
          fontWeight: '600', color: '#5f5e5a'}}>
          SIZE {sizeToSymbol(listing.size)}
        </Typography>
        <Typography sx={{fontSize: '15px',
          fontWeight: '325', color: '#141413', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
          {listing.title}
        </Typography>
        <Box sx={{display: 'flex', justifyContent: 'space-between',
          alignItems: 'center'}}>
          <Typography sx={{fontSize: '19px',
            fontWeight: '700', color: '#141413'}}>
            ${listing.price}
          </Typography>
          <AddToCartButton listingid={listing.id} />
        </Box>
      </Box>
    </Box>
  );
}

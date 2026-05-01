import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {KitListing} from '../kit_listing';
import {sizeToSymbol} from './helperFuncs';

export default function KitListItem(
  { listing }: { listing: KitListing }) {
  return(
    <Box sx={{borderRadius: '10px', border: '1px solid #b3b2ae',
      overflow: 'hidden', width: '100%', position: 'relative'}}>
      <Box 
        component='img'
        src={listing.image ?? 'http://localhost:3000/blankJersey.jpg'}
        alt={listing.title}
        sx={{width: '100%'}}
      />
      <IconButton aria-label="add to wishlist" sx={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        padding: '3px',
        backgroundColor: '#d3d1c7',
        '&:hover': { backgroundColor: '#d3d1c7' }
      }}>
        <FavoriteBorderIcon sx={{ color: '#141413', fontSize: '25px' }} />
      </IconButton>
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
          <IconButton aria-label="add to cart" sx={{padding: '0px'}}>
            <AddCircleIcon sx={{color: '#141413', fontSize: '35px'}}/>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

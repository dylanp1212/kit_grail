import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {addToWishlist, removeFromWishlist, checkInWishlist} from '../wishlist/actions';
import {useState, useEffect} from 'react';

export default function WishlistButton(
  {listingid}: {listingid: string}) {
  const [inWishlist, setInWishlist] = useState(false)
  useEffect(() => {
    const check = async (): Promise<void> => {
      const iw = await checkInWishlist(listingid);
      setInWishlist(iw);
    }
    void check();
  }, []);
  // keep React.mouseEvent, was getting a type error
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (inWishlist) {
      void removeFromWishlist(listingid);
      setInWishlist(false);
    } else {
      void addToWishlist(listingid);
      setInWishlist(true);
    }
  }
  return (
    <IconButton aria-label={inWishlist? "remove from wishlist": "add to wishlist"} 
      sx={{position: 'absolute', top: '8px', right: '8px', padding: '3px',
      backgroundColor: '#d3d1c7', '&:hover': {backgroundColor: '#d3d1c7'}}}
      onClick={handleClick}>
      {inWishlist ? <FavoriteIcon sx={{ color: '#141413', fontSize: '25px' }} /> : <FavoriteBorderIcon sx={{ color: '#141413', fontSize: '25px' }} />}
      {/* <FavoriteBorderIcon sx={{ color: '#141413', fontSize: '25px' }} /> */}
    </IconButton>
  );
}
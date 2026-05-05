import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {addToWishlist, removeFromWishlist, checkInWishlist} from '../wishlist/actions';
import {useState, useEffect} from 'react';

export default function WishlistButton(
  {listingid, userid}: {listingid: string, userid?: string}) {
  const [inWishlist, setInWishlist] = useState(false)
  useEffect(() => {
    const check = async (): Promise<void> => {
      if (!userid) {
        return
      }
      const iw = await checkInWishlist(listingid, userid);
      setInWishlist(iw);
    }
    void check();
  }, []);
  const handleClick = (e) => {
    e.stopPropagation()
    if (!userid) {
      // #######
      // should redirect to login
      // just returning for now since login not set up
      // #######
      return
    }
    if (inWishlist) {
      removeFromWishlist(listingid, userid);
      setInWishlist(false);
    } else {
      addToWishlist(listingid, userid);
      setInWishlist(true);
    }
  }
  return (
    <IconButton aria-label="add to wishlist" 
      sx={{position: 'absolute', top: '8px', right: '8px', padding: '3px',
      backgroundColor: '#d3d1c7', '&:hover': {backgroundColor: '#d3d1c7'}}}
      onClick={handleClick}>
      {inWishlist ? <FavoriteIcon sx={{ color: '#141413', fontSize: '25px' }} /> : <FavoriteBorderIcon sx={{ color: '#141413', fontSize: '25px' }} />}
      {/* <FavoriteBorderIcon sx={{ color: '#141413', fontSize: '25px' }} /> */}
    </IconButton>
  );
}
import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {addToCart, checkInCart} from '../shoppingcart/actions';
import {useState, useEffect} from 'react';

export default function AddToCartButton(
  {listingid, userid}: {listingid: string, userid?: string}) {
  const [inCart, setInCart] = useState(false)
  useEffect(() => {
    const check = async (): Promise<void> => {
      if (!userid) {
        return
      }
      const ic = await checkInCart(listingid, userid);
      setInCart(ic);
    }
    void check();
  }, []);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (inCart) {
      setInCart(false);
    } else {
      if (userid) void addToCart(listingid, userid);
      setInCart(true);
    }
  }
  return (
    <IconButton aria-label={inCart? "remove from cart": "add to cart"} 
      sx={{position: 'absolute', top: '8px', right: '8px', padding: '3px',
      backgroundColor: '#d3d1c7', '&:hover': {backgroundColor: '#d3d1c7'}}}
      onClick={handleClick}>
      {inCart ? <CheckCircleIcon sx={{ color: '#141413', fontSize: '25px' }} /> : <AddCircleIcon sx={{ color: '#141413', fontSize: '25px' }} />}
    </IconButton>
  );
}
 

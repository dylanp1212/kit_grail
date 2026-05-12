import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {addToCart, checkInCart} from '../shoppingcart/actions';
import {useState, useEffect} from 'react';

export default function AddToCartButton(
  {listingid}: {listingid: string}) {
  const [inCart, setInCart] = useState(false)
  useEffect(() => {
    const check = async (): Promise<void> => {
      const ic = await checkInCart(listingid);
      setInCart(ic);
    }
    void check();
  }, []);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    void addToCart(listingid);
    setInCart(true);
  }
  return (
    <IconButton aria-label="add to cart" disabled={inCart}
      sx={{padding: '3px',
      backgroundColor: '#d3d1c7', '&:hover': {backgroundColor: '#d3d1c7'}}}
      onClick={handleClick}>
      {inCart ? <CheckCircleIcon sx={{ color: '#141413', fontSize: '25px' }} /> : <AddCircleIcon sx={{ color: '#141413', fontSize: '25px' }} />}
    </IconButton>
  );
}

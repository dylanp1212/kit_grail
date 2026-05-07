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
      if (userid) {
        const ic = await checkInCart(listingid, userid);
        setInCart(ic);
      } else {
        // user is a guest check local storage for cart
        const cart = JSON.parse(localStorage.getItem('cart') ?? '[]')
        setInCart(cart.includes(listingid))
      }
    }
    void check();
  }, []);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (userid) {
      void addToCart(listingid, userid);
    } else {
      // add to local storage cart for guest user
      const cart: string[] = JSON.parse(localStorage.getItem('cart') ?? '[]')
      localStorage.setItem('cart', JSON.stringify([...cart, listingid]))
    }
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
 

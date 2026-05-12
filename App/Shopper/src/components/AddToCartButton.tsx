import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {useCart} from '../shoppingcart/useCart';

export default function AddToCartButton({listingid}: {listingid: string}) {
  const {inCart, handleClick} = useCart(listingid)
  return (
    <IconButton aria-label="add to cart" disabled={inCart}
      sx={{padding: '3px',
      backgroundColor: '#d3d1c7', '&:hover': {backgroundColor: '#d3d1c7'}}}
      onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleClick() }}>
      {inCart ? <CheckCircleIcon sx={{ color: '#141413', fontSize: '25px' }} /> : <AddCircleIcon sx={{ color: '#141413', fontSize: '25px' }} />}
    </IconButton>
  );
}

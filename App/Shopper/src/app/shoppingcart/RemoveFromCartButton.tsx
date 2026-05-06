'use client'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {removeFromCart} from '../../shoppingcart/actions';

export default function RemoveFromCartButton({ listingid, userid }: { listingid: string, userid: string }) {
  return (
    <IconButton aria-label="remove from cart" sx={{padding: '0px'}} onClick={() => { void removeFromCart(listingid, userid); }}>
      <DeleteIcon sx={{color: '#141413', fontSize: '35px'}}/>
    </IconButton>
  );
}

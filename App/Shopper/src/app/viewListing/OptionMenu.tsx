'use client'
import Box from '@mui/material/Box'
import AddToCartButton from './AddToCartButton'
import MakeOfferButton from './MakeOfferButton'
import BuyNowButton from './BuyNowButton'


export default function OptionMenu() {
  return (
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <BuyNowButton />
        <AddToCartButton />
        <MakeOfferButton />
        
      </Box>
   
  )
}

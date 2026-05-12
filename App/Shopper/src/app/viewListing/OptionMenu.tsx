'use client'
import Box from '@mui/material/Box'
import AddToCartButton from './AddToCartButton'
import MakeOfferButton from './MakeOfferButton'
import BuyNowButton from './BuyNowButton'


export default function OptionMenu({listingid}: {listingid: string}) {
  return (

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <BuyNowButton />
        <AddToCartButton listingid={listingid} />
        <MakeOfferButton />

      </Box>

  )
}

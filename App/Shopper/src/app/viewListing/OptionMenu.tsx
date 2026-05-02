'use client'
import Box from '@mui/material/Box'
import AddToCartButton from './AddToCartButton'
import MakeOfferButton from './MakeOfferButton'
import SelectQuantity from './SelectQuantity'
import SelectSize from './SelectSize'

export default function OptionMenu() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <SelectSize />
      <SelectQuantity />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <AddToCartButton />
        <MakeOfferButton />
      </Box>
    </Box>
  )
}

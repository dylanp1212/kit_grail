'use client'
import Box from '@mui/material/Box'
import AddToCartButton from './AddToCartButton'

export default function OptionMenu({listingid}: {listingid: string}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <AddToCartButton listingid={listingid} />
    </Box>
  )
}

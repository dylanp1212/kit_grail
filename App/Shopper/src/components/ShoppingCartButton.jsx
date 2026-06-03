'use client'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import { useRouter } from 'next/navigation'
import { useCartCount } from '../shoppingcart/CartCountContext'

const btnSx = { borderRadius: '4px', '&:hover': { bgcolor: '#eeeeea' } }

export default function ShoppingCartButton() {
  const router = useRouter()
  const { count } = useCartCount()

  return (
    <IconButton sx={btnSx} onClick={() => { router.push('/shoppingcart') }}
      aria-label="open shopping cart">
      <Badge badgeContent={count} color="error">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  )
}

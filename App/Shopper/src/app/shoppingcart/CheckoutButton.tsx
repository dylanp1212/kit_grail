'use client'
import Button from '@mui/material/Button'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import {useRouter} from 'next/navigation'
import {getAllCartItems, getShopperId} from '../../shoppingcart/actions'
import {createCheckoutSession} from '../../checkout/service'

export default function CheckoutButton() {
  const router = useRouter()

  const handleCheckout = async () => {
    const [shopperid, items] = await Promise.all([getShopperId(), getAllCartItems()])
    const url = await createCheckoutSession(
      shopperid,
      items.map(item => ({title: item.title, price: item.price, image: item.image})),
      `${window.location.origin}/checkout/success`,
      `${window.location.origin}/shoppingcart`,
    )
    router.push(url)
  }

  return (
    <Button
      onClick={() => { void handleCheckout() }}
      variant="contained"
      fullWidth
      startIcon={<ShoppingBagIcon />}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '56px',
        bgcolor: '#154212',
        color: '#ffffff',
        fontFamily: '"Work Sans", sans-serif',
        fontSize: '18px',
        textTransform: 'none',
        borderRadius: 0,
        '&:hover': { bgcolor: '#23501e' },
      }}
    >
      Proceed to Checkout
    </Button>
  )
}
